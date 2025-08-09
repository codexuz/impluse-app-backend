import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupAssignedLessonDto } from './dto/create-group_assigned_lesson.dto.js';
import { UpdateGroupAssignedLessonDto } from './dto/update-group_assigned_lesson.dto.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';

@Injectable()
export class GroupAssignedLessonsService {
    constructor(
        @InjectModel(GroupAssignedLesson)
        private groupAssignedLessonModel: typeof GroupAssignedLesson
    ) {}

    async create(createGroupAssignedLessonDto: CreateGroupAssignedLessonDto): Promise<GroupAssignedLesson> {
        return await this.groupAssignedLessonModel.create({
            ...createGroupAssignedLessonDto
        });
    }

    async findAll(): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonModel.findAll();
    }

    async findOne(id: string): Promise<GroupAssignedLesson> {
        const assignedLesson = await this.groupAssignedLessonModel.findOne({
            where: { id }
        });

        if (!assignedLesson) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }

        return assignedLesson;
    }

    async findByGroupId(groupId: string): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonModel.findAll({
            where: { group_id: groupId }
        });
    }

    async findByUnitId(unitId: string): Promise<GroupAssignedLesson[]> {
        return await this.groupAssignedLessonModel.findAll({
            where: { group_assigned_unit_id: unitId }
        });
    }

    async update(id: string, updateGroupAssignedLessonDto: UpdateGroupAssignedLessonDto): Promise<GroupAssignedLesson> {
        const [affectedCount] = await this.groupAssignedLessonModel.update(
            updateGroupAssignedLessonDto,
            {
                where: { id }
            }
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.groupAssignedLessonModel.destroy({
            where: { id }
        });

        if (result === 0) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }
    }
}
