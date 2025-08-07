import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { Attendance } from './entities/attendance.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class AttendanceService {
  async create(createAttendanceDto: CreateAttendanceDto) {
    // Check if attendance already exists for this student, group, and date
    const existingAttendance = await Attendance.findOne({
      where: {
        group_id: createAttendanceDto.group_id,
        student_id: createAttendanceDto.student_id,
        date: createAttendanceDto.date
      }
    });

    if (existingAttendance) {
      throw new ConflictException('Attendance record already exists for this student, group, and date');
    }

    return await Attendance.create({
      ...createAttendanceDto,
      note: createAttendanceDto.note || ''
    } as any);
  }

  async findAll() {
    return await Attendance.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
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
    
    // If updating student, group, or date, check for conflicts
    if (updateAttendanceDto.student_id || updateAttendanceDto.group_id || updateAttendanceDto.date) {
      const conflictWhere: any = {
        id: { [Op.ne]: id },
        student_id: updateAttendanceDto.student_id || attendance.student_id,
        group_id: updateAttendanceDto.group_id || attendance.group_id,
        date: updateAttendanceDto.date || attendance.date
      };

      const existingAttendance = await Attendance.findOne({
        where: conflictWhere
      });

      if (existingAttendance) {
        throw new ConflictException('Attendance record already exists for this student, group, and date');
      }
    }

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
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async findByStudentId(student_id: string) {
    return await Attendance.findAll({
      where: { student_id },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async findByTeacherId(teacher_id: string) {
    return await Attendance.findAll({
      where: { teacher_id },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async findByDateRange(startDate: string, endDate: string) {
    return await Attendance.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
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
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async findByStudentAndDateRange(student_id: string, startDate: string, endDate: string) {
    return await Attendance.findAll({
      where: {
        student_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async findByStatus(status: string) {
    return await Attendance.findAll({
      where: { status },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  async getAttendanceStats(group_id?: string, student_id?: string, startDate?: string, endDate?: string) {
    const whereClause: any = {};
    
    if (group_id) whereClause.group_id = group_id;
    if (student_id) whereClause.student_id = student_id;
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const totalRecords = await Attendance.count({ where: whereClause });
    const presentCount = await Attendance.count({ 
      where: { ...whereClause, status: 'present' } 
    });
    const absentCount = await Attendance.count({ 
      where: { ...whereClause, status: 'absent' } 
    });
    const lateCount = await Attendance.count({ 
      where: { ...whereClause, status: 'late' } 
    });

    return {
      total: totalRecords,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendanceRate: totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100).toFixed(2) : '0.00'
    };
  }
}
