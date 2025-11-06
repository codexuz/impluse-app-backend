var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException, ConflictException, } from "@nestjs/common";
import { Attendance } from "./entities/attendance.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { Op } from "sequelize";
let AttendanceService = class AttendanceService {
    async handleTeacherPayment(teacherId, status, studentId, date) {
        if (status !== "present") {
            return;
        }
        try {
            const teacherProfile = await TeacherProfile.findOne({
                where: { user_id: teacherId },
            });
            if (!teacherProfile) {
                console.warn(`Teacher profile not found for teacher ID ${teacherId}`);
                return;
            }
            if (teacherProfile.payment_type === "percentage") {
                const paymentAmount = teacherProfile.payment_value;
                if (paymentAmount && paymentAmount > 0) {
                    let teacherWallet = await TeacherWallet.findOne({
                        where: { teacher_id: teacherId },
                    });
                    if (!teacherWallet) {
                        teacherWallet = await TeacherWallet.create({
                            teacher_id: teacherId,
                            amount: paymentAmount,
                        });
                    }
                    else {
                        await teacherWallet.update({
                            amount: teacherWallet.amount + paymentAmount,
                        });
                    }
                    await TeacherTransaction.create({
                        teacher_id: teacherId,
                        amount: paymentAmount,
                        type: "oylik",
                    });
                    console.log(`Teacher payment processed: ${paymentAmount} for teacher ${teacherId}, student ${studentId}, date ${date}`);
                }
            }
            else {
                console.log(`Teacher ${teacherId} has fixed payment type - no wallet update needed`);
            }
        }
        catch (error) {
            console.error(`Error processing teacher payment for ${teacherId}:`, error);
        }
    }
    async create(createAttendanceDto) {
        const existingAttendance = await Attendance.findOne({
            where: {
                group_id: createAttendanceDto.group_id,
                student_id: createAttendanceDto.student_id,
                date: createAttendanceDto.date,
            },
        });
        if (existingAttendance) {
            throw new ConflictException("Attendance record already exists for this student, group, and date");
        }
        const attendance = await Attendance.create({
            ...createAttendanceDto,
            note: createAttendanceDto.note || "",
        });
        await this.handleTeacherPayment(createAttendanceDto.teacher_id, createAttendanceDto.status, createAttendanceDto.student_id, createAttendanceDto.date);
        return attendance;
    }
    async createBulk(createAttendanceDtos) {
        const createdAttendances = [];
        const errors = [];
        for (const dto of createAttendanceDtos) {
            try {
                const existingAttendance = await Attendance.findOne({
                    where: {
                        group_id: dto.group_id,
                        student_id: dto.student_id,
                        date: dto.date,
                    },
                });
                if (existingAttendance) {
                    errors.push({
                        student_id: dto.student_id,
                        error: "Attendance record already exists for this student, group, and date",
                    });
                    continue;
                }
                const attendance = await Attendance.create({
                    ...dto,
                    note: dto.note || "",
                });
                createdAttendances.push(attendance);
                await this.handleTeacherPayment(dto.teacher_id, dto.status, dto.student_id, dto.date);
            }
            catch (error) {
                errors.push({
                    student_id: dto.student_id,
                    error: error.message,
                });
            }
        }
        return {
            created: createdAttendances,
            errors: errors,
            summary: {
                total_processed: createAttendanceDtos.length,
                successful: createdAttendances.length,
                failed: errors.length,
            },
        };
    }
    async findAll() {
        return await Attendance.findAll({
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findOne(id) {
        const attendance = await Attendance.findByPk(id, {
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
        if (!attendance) {
            throw new NotFoundException(`Attendance record with ID ${id} not found`);
        }
        return attendance;
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.findOne(id);
        const previousStatus = attendance.status;
        if (updateAttendanceDto.student_id ||
            updateAttendanceDto.group_id ||
            updateAttendanceDto.date) {
            const conflictWhere = {
                id: { [Op.ne]: id },
                student_id: updateAttendanceDto.student_id || attendance.student_id,
                group_id: updateAttendanceDto.group_id || attendance.group_id,
                date: updateAttendanceDto.date || attendance.date,
            };
            const existingAttendance = await Attendance.findOne({
                where: conflictWhere,
            });
            if (existingAttendance) {
                throw new ConflictException("Attendance record already exists for this student, group, and date");
            }
        }
        await attendance.update(updateAttendanceDto);
        const newStatus = updateAttendanceDto.status || attendance.status;
        if (newStatus === "present" && previousStatus !== "present") {
            const teacherId = updateAttendanceDto.teacher_id || attendance.teacher_id;
            const studentId = updateAttendanceDto.student_id || attendance.student_id;
            const attendanceDate = updateAttendanceDto.date || attendance.date;
            await this.handleTeacherPayment(teacherId, newStatus, studentId, attendanceDate);
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const attendance = await this.findOne(id);
        await attendance.destroy();
        return { id, deleted: true };
    }
    async findByGroupId(group_id) {
        return await Attendance.findAll({
            where: { group_id },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByStudentId(student_id) {
        return await Attendance.findAll({
            where: { student_id },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByTeacherId(teacher_id) {
        return await Attendance.findAll({
            where: { teacher_id },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByDateRange(startDate, endDate) {
        return await Attendance.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByGroupAndDateRange(group_id, startDate, endDate) {
        return await Attendance.findAll({
            where: {
                group_id,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByStudentAndDateRange(student_id, startDate, endDate) {
        return await Attendance.findAll({
            where: {
                student_id,
                date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
        });
    }
    async findByStatus(status) {
        return await Attendance.findAll({
            where: { status },
            order: [
                ["date", "DESC"],
                ["createdAt", "DESC"],
            ],
            include: [
                {
                    association: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    association: "teacher",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                { association: "group" },
            ],
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
                [Op.between]: [startDate, endDate],
            };
        }
        const totalRecords = await Attendance.count({ where: whereClause });
        const presentCount = await Attendance.count({
            where: { ...whereClause, status: "present" },
        });
        const absentCount = await Attendance.count({
            where: { ...whereClause, status: "absent" },
        });
        const lateCount = await Attendance.count({
            where: { ...whereClause, status: "late" },
        });
        return {
            total: totalRecords,
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            attendanceRate: totalRecords > 0
                ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(2)
                : "0.00",
        };
    }
    async getStudentCurrentMonthAttendance(student_id) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startDate = startOfMonth.toISOString().split("T")[0];
        const endDate = endOfMonth.toISOString().split("T")[0];
        const whereClause = {
            student_id,
            date: {
                [Op.between]: [startDate, endDate],
            },
        };
        const totalRecords = await Attendance.count({ where: whereClause });
        const presentCount = await Attendance.count({
            where: { ...whereClause, status: "present" },
        });
        const absentCount = await Attendance.count({
            where: { ...whereClause, status: "absent" },
        });
        const lateCount = await Attendance.count({
            where: { ...whereClause, status: "late" },
        });
        return {
            month: now.toLocaleString("default", { month: "long", year: "numeric" }),
            student_id,
            total: totalRecords,
            present: presentCount,
            absent: absentCount,
            late: lateCount,
            attendanceRate: totalRecords > 0
                ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(2)
                : "0.00",
        };
    }
};
AttendanceService = __decorate([
    Injectable()
], AttendanceService);
export { AttendanceService };
//# sourceMappingURL=attendance.service.js.map