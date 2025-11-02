import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { Group } from './entities/group.entity.js';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group)
        private groupModel: typeof Group,
    ) {}

    async create(createGroupDto: CreateGroupDto): Promise<Group> {
        return await this.groupModel.create({ ...createGroupDto });
    }

    async findAll(): Promise<Group[]> {
        return await this.groupModel.findAll();
    }

    async findOne(id: string): Promise<Group> {
        const group = await this.groupModel.findOne({ where: { id } });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }

    async findAllStudentsInGroup(id: string): Promise<Group> {
        const group = await this.groupModel.findOne({
            where: { id },
            include: [
                {
                    association: 'students',
                    attributes: { exclude: ['password_hash'] },
                },
            ],
        });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }

    async findTeacherOfGroup(id: string): Promise<Group> {
        const group = await this.groupModel.findOne({
            where: { id },
            include: [
                {
                    association: 'teacher',
                    attributes: { exclude: ['password_hash'] },
                },
            ],
        });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }

  async findByTeacherId(teacherId: string): Promise<Group[]> {
    return await this.groupModel.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          association: "teacher",
          attributes: { exclude: ["password_hash"] },
        },
        {
          association: "level",
          attributes: ["id", "title", "description", "level", "isActive"],
        }
      ],
    });
  }

    async findByLevelId(levelId: string): Promise<Group[]> {
        return await this.groupModel.findAll({ where: { level_id: levelId } });
    }

    async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
        const group = await this.findOne(id);
        await group.update(updateGroupDto);
        return group;
    }

    async remove(id: string): Promise<void> {
        const group = await this.findOne(id);
        await group.destroy();
    }
}



