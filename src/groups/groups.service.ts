import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CreateGroupDto } from "./dto/create-group.dto.js";
import { UpdateGroupDto } from "./dto/update-group.dto.js";
import { Group } from "./entities/group.entity.js";

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    return await this.groupModel.create({ ...createGroupDto });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Group[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { group_code: { [Op.iLike]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.groupModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async countActiveGroups(): Promise<number> {
    return await this.groupModel.count();
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
          association: "students",
          attributes: { exclude: ["password_hash"] },
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
          association: "teacher",
          attributes: { exclude: ["password_hash"] },
        },
      ],
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async findByTeacherId(
    teacherId: string,
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Group[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = { teacher_id: teacherId };

    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { group_code: { [Op.iLike]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.groupModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: "teacher",
          attributes: { exclude: ["password_hash"] },
        },
        {
          association: "level",
          attributes: ["id", "title", "description", "level", "isActive"],
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByLevelId(
    levelId: string,
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Group[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = { level_id: levelId };

    if (query) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { group_code: { [Op.iLike]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.groupModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
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
