import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto.js";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto.js";
import { Attendance } from "./entities/attendance.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { Op } from "sequelize";

@Injectable()
export class AttendanceService {
  private async handleTeacherPayment(
    teacherId: string,
    status: string,
    studentId: string,
    date: string
  ) {
    // Only process payment if status is 'present'
    if (status !== "present") {
      return;
    }

    try {
      // Get teacher profile with payment information
      const teacherProfile = await TeacherProfile.findOne({
        where: { user_id: teacherId },
      });

      if (!teacherProfile) {
        console.warn(`Teacher profile not found for teacher ID ${teacherId}`);
        return; // Don't throw error, just skip payment processing
      }

      // Business logic:
      // - If payment_type is 'percentage': update wallet and create transaction
      // - If payment_type is 'fixed': create attendance but don't process payment
      if (teacherProfile.payment_type === "percentage") {
        const paymentAmount = teacherProfile.payment_value;

        if (paymentAmount && paymentAmount > 0) {
          // Find or create teacher wallet
          let teacherWallet = await TeacherWallet.findOne({
            where: { teacher_id: teacherId },
          });

          if (!teacherWallet) {
            // Create new wallet if doesn't exist
            teacherWallet = await TeacherWallet.create({
              teacher_id: teacherId,
              amount: paymentAmount,
            });
          } else {
            // Update existing wallet by adding the payment amount
            await teacherWallet.update({
              amount: teacherWallet.amount + paymentAmount,
            });
          }

          // Create teacher transaction record for audit trail (one per student)
          await TeacherTransaction.create({
            teacher_id: teacherId,
            amount: paymentAmount,
            type: "oylik", // Payment for attendance
          });

          console.log(
            `Teacher payment processed: ${paymentAmount} for teacher ${teacherId}, student ${studentId}, date ${date}`
          );
        }
      } else {
        console.log(
          `Teacher ${teacherId} has fixed payment type - no wallet update needed`
        );
      }
    } catch (error) {
      console.error(
        `Error processing teacher payment for ${teacherId}:`,
        error
      );
      // Don't throw error to prevent attendance creation from failing
      // Payment processing failure shouldn't block attendance recording
    }
  }
  async create(createAttendanceDto: CreateAttendanceDto) {
    // Check if attendance already exists for this student, group, and date
    const existingAttendance = await Attendance.findOne({
      where: {
        group_id: createAttendanceDto.group_id,
        student_id: createAttendanceDto.student_id,
        date: createAttendanceDto.date,
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        "Attendance record already exists for this student, group, and date"
      );
    }

    const attendance = await Attendance.create({
      ...createAttendanceDto,
      note: createAttendanceDto.note || "",
    } as any);

    // Handle teacher payment if status is 'present' (per student)
    await this.handleTeacherPayment(
      createAttendanceDto.teacher_id,
      createAttendanceDto.status,
      createAttendanceDto.student_id,
      createAttendanceDto.date
    );

    return attendance;
  }

  async createBulk(createAttendanceDtos: CreateAttendanceDto[]) {
    const createdAttendances = [];
    const errors = [];

    for (const dto of createAttendanceDtos) {
      try {
        // Check if attendance already exists
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
            error:
              "Attendance record already exists for this student, group, and date",
          });
          continue;
        }

        // Create attendance
        const attendance = await Attendance.create({
          ...dto,
          note: dto.note || "",
        } as any);

        createdAttendances.push(attendance);

        // Handle teacher payment if status is 'present' (per student)
        await this.handleTeacherPayment(
          dto.teacher_id,
          dto.status,
          dto.student_id,
          dto.date
        );
      } catch (error) {
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

  async findOne(id: string) {
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

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    const previousStatus = attendance.status;

    // If updating student, group, or date, check for conflicts
    if (
      updateAttendanceDto.student_id ||
      updateAttendanceDto.group_id ||
      updateAttendanceDto.date
    ) {
      const conflictWhere: any = {
        id: { [Op.ne]: id },
        student_id: updateAttendanceDto.student_id || attendance.student_id,
        group_id: updateAttendanceDto.group_id || attendance.group_id,
        date: updateAttendanceDto.date || attendance.date,
      };

      const existingAttendance = await Attendance.findOne({
        where: conflictWhere,
      });

      if (existingAttendance) {
        throw new ConflictException(
          "Attendance record already exists for this student, group, and date"
        );
      }
    }

    // Update the attendance record
    await attendance.update(updateAttendanceDto);

    // Handle teacher payment if status is being updated to 'present' and wasn't 'present' before
    const newStatus = updateAttendanceDto.status || attendance.status;
    if (newStatus === "present" && previousStatus !== "present") {
      const teacherId = updateAttendanceDto.teacher_id || attendance.teacher_id;
      const studentId = updateAttendanceDto.student_id || attendance.student_id;
      const attendanceDate = updateAttendanceDto.date || attendance.date;
      await this.handleTeacherPayment(
        teacherId,
        newStatus,
        studentId,
        attendanceDate
      );
    }

    // Reload the attendance to return updated data
    return await this.findOne(id);
  }

  async remove(id: string) {
    const attendance = await this.findOne(id);
    await attendance.destroy();
    return { id, deleted: true };
  }

  async findByGroupId(group_id: string) {
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

  async findByStudentId(student_id: string) {
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

  async findByTeacherId(teacher_id: string) {
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

  async findByDateRange(startDate: string, endDate: string) {
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

  async findByGroupAndDateRange(
    group_id: string,
    startDate: string,
    endDate: string
  ) {
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

  async findByStudentAndDateRange(
    student_id: string,
    startDate: string,
    endDate: string
  ) {
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

  async findByStatus(status: string) {
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

  async getAttendanceStats(
    group_id?: string,
    student_id?: string,
    startDate?: string,
    endDate?: string
  ) {
    const whereClause: any = {};

    if (group_id) whereClause.group_id = group_id;
    if (student_id) whereClause.student_id = student_id;
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
      attendanceRate:
        totalRecords > 0
          ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(2)
          : "0.00",
    };
  }

  async getStudentCurrentMonthAttendance(student_id: string) {
    // Get current month's start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format dates to YYYY-MM-DD for database query
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
      attendanceRate:
        totalRecords > 0
          ? (((presentCount + lateCount) / totalRecords) * 100).toFixed(2)
          : "0.00",
    };
  }
}
