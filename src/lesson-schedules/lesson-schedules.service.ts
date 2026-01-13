import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
import { Op } from "sequelize";

@Injectable()
export class LessonSchedulesService {
  async create(createLessonScheduleDto: CreateLessonScheduleDto) {
    return await LessonSchedule.create(createLessonScheduleDto as any);
  }

  async findAll() {
    return await LessonSchedule.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string) {
    const lessonSchedule = await LessonSchedule.findByPk(id, {
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });

    if (!lessonSchedule) {
      throw new NotFoundException(`Lesson schedule with ID ${id} not found`);
    }

    return lessonSchedule;
  }

  async findByGroupId(groupId: string) {
    return await LessonSchedule.findAll({
      where: { group_id: groupId },
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }

  async update(id: string, updateLessonScheduleDto: UpdateLessonScheduleDto) {
    const lessonSchedule = await this.findOne(id);
    await lessonSchedule.update(updateLessonScheduleDto as any);
    return lessonSchedule;
  }

  async remove(id: string) {
    const lessonSchedule = await this.findOne(id);
    await lessonSchedule.destroy();
    return { id, deleted: true };
  }

  async findActiveSchedules() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    return await LessonSchedule.findAll({
      where: {
        date: {
          [Op.gte]: currentDate,
        },
      },
      order: [["date", "ASC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }
}
