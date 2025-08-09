import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupStudentDto } from './dto/create-group-student.dto.js';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto.js';
import { GroupStudent } from './entities/group-student.entity.js';
import { Group } from '../groups/entities/group.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class GroupStudentsService {
    constructor(
        @InjectModel(GroupStudent)
        private groupStudentModel: typeof GroupStudent,
        @InjectModel(Group)
        private groupModel: typeof Group
    ) {}

    async create(createDto: CreateGroupStudentDto): Promise<GroupStudent> {
        return await this.groupStudentModel.create({
            ...createDto
        });
    }

    async findAll(): Promise<GroupStudent[]> {
        return await this.groupStudentModel.findAll();
    }

    async findOne(id: string): Promise<GroupStudent> {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { id }
        });

        if (!groupStudent) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }

        return groupStudent;
    }

    async findByGroupId(groupId: string): Promise<GroupStudent[]> {
        return await this.groupStudentModel.findAll({
            where: { group_id: groupId }
        });
    }

    async findByStudentId(studentId: string): Promise<GroupStudent[]> {
        return await this.groupStudentModel.findAll({
            where: { student_id: studentId }
        });
    }

    async findActiveByGroupId(groupId: string): Promise<GroupStudent[]> {
        return await this.groupStudentModel.findAll({
            where: { 
                group_id: groupId,
                status: 'active'
            }
        });
    }

    async update(id: string, updateDto: UpdateGroupStudentDto): Promise<GroupStudent> {
        const [affectedCount] = await this.groupStudentModel.update(
            updateDto,
            {
                where: { id }
            }
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.groupStudentModel.destroy({
            where: { id }
        });

        if (result === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }
    }

    async updateStatus(id: string, status: string): Promise<GroupStudent> {
        const [affectedCount] = await this.groupStudentModel.update(
            { status },
            { where: { id } }
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }

        return await this.findOne(id);
    }

    async countStudentsByTeacher(teacherId: string): Promise<number> {
        // First get all groups for this teacher
        const teacherGroups = await this.groupModel.findAll({
            where: { teacher_id: teacherId },
            attributes: ['id']
        });

        if (teacherGroups.length === 0) {
            return 0;
        }

        // Extract group IDs
        const groupIds = teacherGroups.map(group => group.id);

        // Count distinct students across all teacher's groups
        const studentCount = await this.groupStudentModel.count({
            where: { 
                group_id: groupIds,
                status: 'active' // Only count active students
            },
            distinct: true,
            col: 'student_id' // Count distinct students (in case a student is in multiple groups)
        });

        return studentCount;
    }

    async getStudentsByTeacher(teacherId: string): Promise<GroupStudent[]> {
        // Get all groups for this teacher
        const teacherGroups = await this.groupModel.findAll({
            where: { teacher_id: teacherId },
            attributes: ['id']
        });

        if (teacherGroups.length === 0) {
            return [];
        }

        // Extract group IDs
        const groupIds = teacherGroups.map(group => group.id);

        // Get all group students for this teacher's groups
        return await this.groupStudentModel.findAll({
            where: { 
                group_id: groupIds,
                status: 'active' // Only active students
            },
            include: [
                {
                    model: User,
                    as: 'student',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: Group,
                    as: 'group',
                    attributes: ['id', 'name']
                }
            ]
        });
    }
}
