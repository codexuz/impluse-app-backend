import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupAssignedUnitDto } from './dto/create-group_assigned_unit.dto.js';
import { UpdateGroupAssignedUnitDto } from './dto/update-group_assigned_unit.dto.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
import { LessonService } from '../lesson/lesson.service.js';
import { GroupAssignedLessonsService } from '../group_assigned_lessons/group_assigned_lessons.service.js';
import { GroupHomeworksService } from '../group_homeworks/group_homeworks.service.js';

@Injectable()
export class GroupAssignedUnitsService {
    constructor(
        @InjectModel(GroupAssignedUnit)
        private groupAssignedUnitModel: typeof GroupAssignedUnit,
        private lessonService: LessonService,
        private groupAssignedLessonsService: GroupAssignedLessonsService,
        private groupHomeworksService: GroupHomeworksService
    ) {}

    async create(createDto: CreateGroupAssignedUnitDto): Promise<GroupAssignedUnit> {
        // Create the assigned unit
        const assignedUnit = await this.groupAssignedUnitModel.create({
            ...createDto
        });

        try {
            // Get all lessons for this unit
            const lessons = await this.lessonService.findByModuleId(createDto.unit_id);
            
            if (lessons && lessons.length > 0) {
                // Use provided dates or default to current date
                const startDate = createDto.start_date ? new Date(createDto.start_date) : new Date();
                const endDate = createDto.end_date ? new Date(createDto.end_date) : new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // Default to 30 days if not provided
                
                // Create lesson assignments for each lesson
                const lessonPromises = lessons.map((lesson, index) => {
                    // All lessons will use the same start and end date as provided by frontend
                    // This allows the teacher to decide when students can access all lessons
                    
                    // Create lesson assignment
                    return this.groupAssignedLessonsService.create({
                        lesson_id: lesson.id,
                        group_id: createDto.group_id,
                        granted_by: createDto.teacher_id,
                        group_assigned_unit_id: assignedUnit.id,
                        start_from: startDate,
                        end_at: endDate,
                        status: createDto.status // Inherit the same status as the unit
                    });
                });
                
                // Wait for all lesson assignments to be created
                await Promise.all(lessonPromises);
                
                // Create homeworks for each lesson
                const homeworkPromises = lessons.map((lesson) => {
                    // Calculate homework deadline (e.g., 3 days before lesson end date)
                    const homeworkDeadline = new Date(endDate);
                    homeworkDeadline.setDate(homeworkDeadline.getDate() - 3); // 3 days before end date
                    
                    // Create homework for each lesson
                    return this.groupHomeworksService.create({
                        lesson_id: lesson.id,
                        group_id: createDto.group_id,
                        teacher_id: createDto.teacher_id,
                        title: `${lesson.title} - Homework`, // Auto-generate title based on lesson
                        start_date: startDate,
                        deadline: homeworkDeadline > startDate ? homeworkDeadline : endDate // Ensure deadline is not before start date
                    });
                });
                
                // Wait for all homework assignments to be created
                await Promise.all(homeworkPromises);
            }
        } catch (error) {
            console.error('Failed to assign lessons and homeworks to group:', error);
            // Note: We're not deleting the unit assignment if lesson/homework assignment fails
            // This is a design choice - consider if you want to make this atomic
        }
        
        return assignedUnit;
    }

    async findAll(): Promise<GroupAssignedUnit[]> {
        return await this.groupAssignedUnitModel.findAll({
            include: ['unit']
        });
    }

    async findOne(id: string): Promise<GroupAssignedUnit> {
        const assigned = await this.groupAssignedUnitModel.findByPk(id, {
            include: ['unit']
        });

        if (!assigned) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }

        return assigned;
    }

    async findByGroupId(groupId: string): Promise<GroupAssignedUnit[]> {
        return await this.groupAssignedUnitModel.findAll({
            where: { group_id: groupId },
            include: [
                {
                    association: 'unit',
                    order: [['order', 'ASC']]
                },
                {
                    association: 'lessons',
                    include: [
                        {
                            association: 'lesson',
                            order: [['order', 'ASC']]
                        }
                    ]
                }
            ],
            order: [['createdAt', 'ASC']]
        });
    }

    async update(id: string, updateDto: UpdateGroupAssignedUnitDto): Promise<GroupAssignedUnit> {
        // First check if the unit exists
        const unit = await this.findOne(id);
        
        // Update the unit
        const [affectedCount] = await this.groupAssignedUnitModel.update(
            updateDto,
            {
                where: { id }
            }
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }

        // If date fields are updated, also update the dates for all assigned lessons
        if (updateDto.start_date || updateDto.end_date) {
            try {
                // Get all lessons assigned to this unit
                const assignedLessons = await this.groupAssignedLessonsService.findByUnitId(id);
                
                if (assignedLessons && assignedLessons.length > 0) {
                    // Use provided dates or keep existing ones
                    const startDate = updateDto.start_date ? new Date(updateDto.start_date) : null;
                    const endDate = updateDto.end_date ? new Date(updateDto.end_date) : null;
                    
                    // Update each lesson assignment with the new dates
                    const updatePromises = assignedLessons.map(lesson => 
                        this.groupAssignedLessonsService.update(lesson.id, {
                            ...(startDate && { start_from: startDate }),
                            ...(endDate && { end_at: endDate }),
                            ...(updateDto.status && { status: updateDto.status })
                        })
                    );
                    
                    await Promise.all(updatePromises);
                }
            } catch (error) {
                console.error(`Failed to update lesson assignments for unit ${id}:`, error);
                // We don't throw here to keep the unit update even if lesson updates fail
            }
        }

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        // First find the assigned unit to ensure it exists
        const assignedUnit = await this.groupAssignedUnitModel.findByPk(id);
        
        if (!assignedUnit) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }
        
        // Remove all associated lesson assignments first
        try {
            // Get all lessons assigned for this unit
            const assignedLessons = await this.groupAssignedLessonsService.findByUnitId(id);
            
            // Delete each lesson assignment
            if (assignedLessons && assignedLessons.length > 0) {
                const deletePromises = assignedLessons.map(lesson => 
                    this.groupAssignedLessonsService.remove(lesson.id)
                );
                
                await Promise.all(deletePromises);
            }
        } catch (error) {
            console.error(`Failed to remove lesson assignments for unit ${id}:`, error);
            // Continue with deletion even if lesson deletion fails
        }
        
        // Now remove the unit assignment
        await assignedUnit.destroy();
    }
}
