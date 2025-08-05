import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAttendanceStatusDto } from './dto/create-attendance-status.dto.js';
import { UpdateAttendanceStatusDto } from './dto/update-attendance-status.dto.js';
import { AttendanceStatus } from './entities/attendance_status.entity.js';
import { Attendance } from '../attendance/entities/attendance.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class AttendanceStatusService {
  async create(createAttendanceStatusDto: CreateAttendanceStatusDto) {
    // Check if status already exists for this student and attendance
    const existingStatus = await AttendanceStatus.findOne({
      where: {
        attendance_id: createAttendanceStatusDto.attendance_id,
        student_id: createAttendanceStatusDto.student_id,
      },
    });

    if (existingStatus) {
      throw new ConflictException('Attendance status already exists for this student in this attendance record');
    }

    return await AttendanceStatus.create({
      ...createAttendanceStatusDto
    } as any);
  }

  async findAll() {
    return await AttendanceStatus.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
            }
          ]
        },
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
        }
      ]
    });
  }

  async findOne(id: string) {
    const status = await AttendanceStatus.findByPk(id, {
      include: [
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
            }
          ]
        },
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
        }
      ]
    });
    if (!status) {
      throw new NotFoundException(`Attendance status with ID ${id} not found`);
    }
    return status;
  }

  async update(id: string, updateAttendanceStatusDto: UpdateAttendanceStatusDto) {
    const status = await this.findOne(id);
    await status.update(updateAttendanceStatusDto);
    return status;
  }

  async remove(id: string) {
    const status = await this.findOne(id);
    await status.destroy();
    return { id, deleted: true };
  }

  async findByAttendanceId(attendance_id: string) {
    return await AttendanceStatus.findAll({
      where: { attendance_id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
            }
          ]
        },
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
        }
      ]
    });
  }

  async findByStudentId(student_id: string) {
    return await AttendanceStatus.findAll({
      where: { student_id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
            }
          ]
        },
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
        }
      ]
    });
  }

  async findByStudentAndDateRange(student_id: string, startDate: string, endDate: string) {
    return await AttendanceStatus.findAll({
      where: {
        student_id,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Attendance,
          as: 'attendance',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
            }
          ]
        },
        {
          model: User,
          as: 'student',
          attributes: ['user_id', 'first_name', 'last_name', 'phone', 'avatar_url']
        }
      ]
    });
  }

  async bulkCreate(statuses: CreateAttendanceStatusDto[]) {
    // Validate no duplicate student records for the same attendance
    const attendanceIds = [...new Set(statuses.map(s => s.attendance_id))];
    const studentIds = statuses.map(s => s.student_id);

    const existingStatuses = await AttendanceStatus.findAll({
      where: {
        attendance_id: attendanceIds,
        student_id: studentIds,
      },
    });

    if (existingStatuses.length > 0) {
      throw new ConflictException('Some students already have attendance status records');
    }

    return await AttendanceStatus.bulkCreate(statuses as any[]);
  }

  async getStudentAttendanceStats(student_id: string, startDate: string, endDate: string) {
    const statuses = await AttendanceStatus.findAll({
      where: {
        student_id,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return {
      total: statuses.length,
      present: statuses.filter(s => s.status === 'present').length,
      absent: statuses.filter(s => s.status === 'absent').length,
      late: statuses.filter(s => s.status === 'late').length,
      attendance_rate: statuses.length > 0 
        ? ((statuses.filter(s => s.status === 'present').length / statuses.length) * 100).toFixed(2)
        : 0,
    };
  }
}
