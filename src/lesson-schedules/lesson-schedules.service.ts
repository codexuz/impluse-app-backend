import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
import { Op } from "sequelize";

@Injectable()
export class LessonSchedulesService {
  async create(createLessonScheduleDto: CreateLessonScheduleDto) {
    // Check if schedule already exists for this group with overlapping time
    if (
      createLessonScheduleDto.group_id &&
      createLessonScheduleDto.start_time &&
      createLessonScheduleDto.end_time
    ) {
      const existingSchedule = await LessonSchedule.findOne({
        where: {
          group_id: createLessonScheduleDto.group_id,
          [Op.or]: [
            // Case 1: New schedule starts during an existing schedule
            {
              start_time: {
                [Op.lte]: createLessonScheduleDto.start_time,
              },
              end_time: {
                [Op.gte]: createLessonScheduleDto.start_time,
              },
            },
            // Case 2: New schedule ends during an existing schedule
            {
              start_time: {
                [Op.lte]: createLessonScheduleDto.end_time,
              },
              end_time: {
                [Op.gte]: createLessonScheduleDto.end_time,
              },
            },
            // Case 3: New schedule completely contains an existing schedule
            {
              start_time: {
                [Op.gte]: createLessonScheduleDto.start_time,
              },
              end_time: {
                [Op.lte]: createLessonScheduleDto.end_time,
              },
            },
          ],
        },
      });

      if (existingSchedule) {
        throw new ConflictException(
          "A lesson schedule already exists for this group with overlapping time"
        );
      }
    }

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

    // Check for overlapping times if updating times or group
    if (
      updateLessonScheduleDto.start_time ||
      updateLessonScheduleDto.end_time ||
      updateLessonScheduleDto.group_id
    ) {
      const groupId =
        updateLessonScheduleDto.group_id || lessonSchedule.group_id;
      const startTime =
        updateLessonScheduleDto.start_time || lessonSchedule.start_time;
      const endTime =
        updateLessonScheduleDto.end_time || lessonSchedule.end_time;

      const existingSchedule = await LessonSchedule.findOne({
        where: {
          id: { [Op.ne]: id },
          group_id: groupId,
          [Op.or]: [
            // Case 1: Updated schedule starts during an existing schedule
            {
              start_time: {
                [Op.lte]: startTime,
              },
              end_time: {
                [Op.gte]: startTime,
              },
            },
            // Case 2: Updated schedule ends during an existing schedule
            {
              start_time: {
                [Op.lte]: endTime,
              },
              end_time: {
                [Op.gte]: endTime,
              },
            },
            // Case 3: Updated schedule completely contains an existing schedule
            {
              start_time: {
                [Op.gte]: startTime,
              },
              end_time: {
                [Op.lte]: endTime,
              },
            },
          ],
        },
      });

      if (existingSchedule) {
        throw new ConflictException(
          "A lesson schedule already exists for this group with overlapping time"
        );
      }
    }

    await lessonSchedule.update(updateLessonScheduleDto);
    return lessonSchedule;
  }

  async remove(id: string) {
    const lessonSchedule = await this.findOne(id);
    await lessonSchedule.destroy();
    return { id, deleted: true };
  }

  async findActiveSchedules() {
    const currentDate = new Date();

    return await LessonSchedule.findAll({
      where: {
        // Find schedules where end_time is in the future
        end_time: {
          [Op.gte]: currentDate,
        },
      },
      order: [["start_time", "ASC"]],
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
