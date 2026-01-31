import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CreateGroupDto } from "./dto/create-group.dto.js";
import { UpdateGroupDto } from "./dto/update-group.dto.js";
import { Group } from "./entities/group.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { GroupAssignedUnit } from "../group_assigned_units/entities/group_assigned_unit.entity.js";
import { GroupAssignedLesson } from "../group_assigned_lessons/entities/group_assigned_lesson.entity.js";

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(Lesson)
    private lessonModel: typeof Lesson,
    @InjectModel(GroupAssignedUnit)
    private groupAssignedUnitModel: typeof GroupAssignedUnit,
    @InjectModel(GroupAssignedLesson)
    private groupAssignedLessonModel: typeof GroupAssignedLesson,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = await this.groupModel.create({ ...createGroupDto });

    // If level_id (course id) is provided, auto-assign units and lessons
    if (createGroupDto.level_id) {
      await this.assignCourseUnitsAndLessonsToGroup(
        group.id,
        createGroupDto.level_id,
        createGroupDto.teacher_id,
      );
    }

    return group;
  }

  /**
   * Assigns all units and lessons from a course to a group
   * @param groupId - The ID of the group
   * @param courseId - The ID of the course (level_id)
   * @param teacherId - The ID of the teacher (optional)
   */
  private async assignCourseUnitsAndLessonsToGroup(
    groupId: string,
    courseId: string,
    teacherId?: string,
  ): Promise<void> {
    try {
      // Get all units for the course
      const units = await this.unitModel.findAll({
        where: {
          courseId,
          isActive: true,
        },
        order: [["order", "ASC"]],
      });

      if (!units.length) {
        return; // No units to assign
      }

      // Default dates: start from today, end after 30 days per unit
      const startDate = new Date();

      for (const unit of units) {
        // Create GroupAssignedUnit
        const assignedUnit = await this.groupAssignedUnitModel.create({
          group_id: groupId,
          unit_id: unit.id,
          teacher_id: teacherId || null,
          status: "unlocked", // Default to unlocked, teacher can lock later
        });

        // Get all lessons for this unit
        const lessons = await this.lessonModel.findAll({
          where: {
            moduleId: unit.id,
            isActive: true,
          },
          order: [["order", "ASC"]],
        });

        if (lessons.length > 0) {
          // Calculate end date (30 days from start by default)
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 30);

          // Create GroupAssignedLesson for each lesson
          const lessonAssignments = lessons.map((lesson) => ({
            lesson_id: lesson.id,
            group_id: groupId,
            granted_by: teacherId || null,
            group_assigned_unit_id: assignedUnit.id,
            start_from: startDate,
            end_at: endDate,
            status: "unlocked", // Default to unlocked, teacher can lock later
          }));

          await this.groupAssignedLessonModel.bulkCreate(lessonAssignments);
        }
      }
    } catch (error) {
      console.error("Failed to auto-assign units and lessons to group:", error);
      // We don't throw here to avoid failing the group creation
      // The group is created, but assignments may need to be done manually
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string,
    level_id?: string,
    teacher_id?: string,
    days?: string,
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
      whereClause[Op.or] = [{ name: { [Op.like]: `%${query}%` } }];
    }

    if (level_id) {
      whereClause.level_id = level_id;
    }

    if (teacher_id) {
      whereClause.teacher_id = teacher_id;
    }

    if (days) {
      whereClause.days = days;
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
    query?: string,
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
      whereClause[Op.or] = [{ name: { [Op.like]: `%${query}%` } }];
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
    query?: string,
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
      whereClause[Op.or] = [{ name: { [Op.like]: `%${query}%` } }];
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

    // Delete all group assigned lessons for this group
    await this.groupAssignedLessonModel.destroy({
      where: { group_id: id },
    });

    // Delete all group assigned units for this group
    await this.groupAssignedUnitModel.destroy({
      where: { group_id: id },
    });

    // Delete the group
    await group.destroy();
  }
}
