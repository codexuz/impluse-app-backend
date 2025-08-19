var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity.js';
import { Op } from 'sequelize';
let AttendanceService = class AttendanceService {
    async create(createAttendanceDto) {
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
        });
    }
    async findAll() {
        return await Attendance.findAll({
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async findOne(id) {
        const attendance = await Attendance.findByPk(id);
        if (!attendance) {
            throw new NotFoundException(`Attendance record with ID ${id} not found`);
        }
        return attendance;
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.findOne(id);
        if (updateAttendanceDto.student_id || updateAttendanceDto.group_id || updateAttendanceDto.date) {
            const conflictWhere = {
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
    async remove(id) {
        const attendance = await this.findOne(id);
        await attendance.destroy();
        return { id, deleted: true };
    }
    async findByGroupId(group_id) {
        return await Attendance.findAll({
            where: { group_id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async findByStudentId(student_id) {
        return await Attendance.findAll({
            where: { student_id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async findByTeacherId(teacher_id) {
        return await Attendance.findAll({
            where: { teacher_id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async findByDateRange(startDate, endDate) {
        return await Attendance.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async findByGroupAndDateRange(group_id, startDate, endDate) {
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
    async findByStudentAndDateRange(student_id, startDate, endDate) {
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
    async findByStatus(status) {
        return await Attendance.findAll({
            where: { status },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
    }
    async getAttendanceStats(group_id, student_id, startDate, endDate) {
        const whereClause = {};
        if (group_id)
            whereClause.group_id = group_id;
        if (student_id)
            whereClause.student_id = student_id;
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
};
AttendanceService = __decorate([
    Injectable()
], AttendanceService);
export { AttendanceService };
//# sourceMappingURL=attendance.service.js.map