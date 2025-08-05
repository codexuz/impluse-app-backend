import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { Attendance } from './entities/attendance.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class AttendanceService {
  async create(createAttendanceDto: CreateAttendanceDto) {
    // Check if attendance already exists for this group, lesson, and date
    const existingAttendance = await Attendance.findOne({
      where: {
        group_id: createAttendanceDto.group_id,
        lesson_id: createAttendanceDto.lesson_id,
        date: createAttendanceDto.date
      }
    });

    if (existingAttendance) {
      throw new Error('Attendance record already exists for this group, lesson, and date');
    }

    return await Attendance.create({
      ...createAttendanceDto
    } as any);
  }

  async findAll() {
    return await Attendance.findAll({
      order: [['date', 'DESC']]
    });
  }

  async findOne(id: string) {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    await attendance.update(updateAttendanceDto);
    return attendance;
  }

  async remove(id: string) {
    const attendance = await this.findOne(id);
    await attendance.destroy();
    return { id, deleted: true };
  }

  async findByGroupId(group_id: string) {
    return await Attendance.findAll({
      where: { group_id },
      order: [['date', 'DESC']]
    });
  }

  async findByTeacherId(teacher_id: string) {
    return await Attendance.findAll({
      where: { teacher_id },
      order: [['date', 'DESC']]
    });
  }

  async findByDateRange(startDate: string, endDate: string) {
    return await Attendance.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC']]
    });
  }

  async findByGroupAndDateRange(group_id: string, startDate: string, endDate: string) {
    return await Attendance.findAll({
      where: {
        group_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC']]
    });
  }
}
