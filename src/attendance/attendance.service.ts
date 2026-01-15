import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateAttendanceDto } from "./dto/create-attendance.dto.js";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto.js";
import { Attendance } from "./entities/attendance.entity.js";
import {
  AttendanceLog,
  AttendanceStatus,
  AttendanceAction,
} from "./entities/attendance-log.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { CompensateLessonsService } from "../compensate-lessons/compensate-lessons.service.js";
import { Op } from "sequelize";

@Injectable()
export class AttendanceService {
  constructor(private compensateLessonsService: CompensateLessonsService) {}

  private async handleTeacherPayment(
    teacherId: string,
    status: string,
    studentId: string,
    date: string,
    attendanceId: string,
    markedBy: string,
    oldStatus?: string
  ) {
    try {
      // Create attendance log
      await AttendanceLog.create({
        attendance_id: attendanceId,
        student_id: studentId,
        marked_by: markedBy,
        new_status: status as AttendanceStatus,
        old_status: oldStatus as AttendanceStatus,
        action: oldStatus
          ? AttendanceAction.STATUS_CHANGED
          : AttendanceAction.STATUS_CREATED,
      });

      // Get teacher profile with payment information
      const teacherProfile = await TeacherProfile.findOne({
        where: { user_id: teacherId },
      });

      if (!teacherProfile) {
        console.warn(`Teacher profile not found for teacher ID ${teacherId}`);
        return; // Don't throw error, just skip payment processing
      }

      // Handle absent students with percentage-based payment
      if (status === "absent" && teacherProfile.payment_type === "percentage") {
        try {
          // Calculate valid_until date (10 days from now)
          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + 10);

          await this.compensateLessonsService.create({
            teacher_id: teacherId,
            student_id: studentId,
            attendance_id: attendanceId,
            compensated: false,
            compensated_by: null as any,
            valid_until: validUntil.toISOString().split("T")[0],
          });

          console.log(
            `Compensate lesson created for absent student ${studentId}, teacher ${teacherId}, attendance ${attendanceId}`
          );
        } catch (error) {
          // Log error but don't throw - compensate lesson creation shouldn't block attendance
          console.error(
            `Error creating compensate lesson for attendance ${attendanceId}:`,
            error.message
          );
        }
        return;
      }

      // Only process payment if status is 'present'
      if (status !== "present") {
        return;
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
            student_id: studentId,
            amount: paymentAmount,
            type: "kirim", // Payment for attendance
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

    // Handle teacher payment and create attendance log
    await this.handleTeacherPayment(
      createAttendanceDto.teacher_id,
      createAttendanceDto.status,
      createAttendanceDto.student_id,
      createAttendanceDto.date,
      attendance.id,
      createAttendanceDto.teacher_id
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

        // Handle teacher payment and create attendance log
        await this.handleTeacherPayment(
          dto.teacher_id,
          dto.status,
          dto.student_id,
          dto.date,
          attendance.id,
          dto.teacher_id
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

  async findAll(
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    const { count, rows } = await Attendance.findAndCountAll({
      where: whereClause,
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
          where: query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${query}%` } },
                  { last_name: { [Op.like]: `%${query}%` } },
                  { username: { [Op.like]: `%${query}%` } },
                ],
              }
            : undefined,
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

    // Handle status change to absent - deduct wallet and delete transaction
    if (
      updateAttendanceDto.status === "absent" &&
      previousStatus === "present"
    ) {
      const teacherId = updateAttendanceDto.teacher_id || attendance.teacher_id;
      const studentId = updateAttendanceDto.student_id || attendance.student_id;

      try {
        // Get teacher profile to check payment type
        const teacherProfile = await TeacherProfile.findOne({
          where: { user_id: teacherId },
        });

        if (
          teacherProfile &&
          teacherProfile.payment_type === "percentage" &&
          teacherProfile.payment_value
        ) {
          // Deduct from teacher wallet
          const teacherWallet = await TeacherWallet.findOne({
            where: { teacher_id: teacherId },
          });

          if (teacherWallet) {
            await teacherWallet.update({
              amount: teacherWallet.amount - teacherProfile.payment_value,
            });
            console.log(
              `Deducted ${teacherProfile.payment_value} from teacher ${teacherId} wallet for absent student ${studentId}`
            );
          }

          // Delete teacher transaction for this student (most recent one)
          const transactionToDelete = await TeacherTransaction.findOne({
            where: {
              teacher_id: teacherId,
              student_id: studentId,
            },
            order: [["created_at", "DESC"]],
          });

          if (transactionToDelete) {
            await transactionToDelete.destroy();
            console.log(
              `Deleted transaction for teacher ${teacherId}, student ${studentId}`
            );
          }

          // Create compensate lesson for absent student
          try {
            // Calculate valid_until date (10 days from now)
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + 10);

            await this.compensateLessonsService.create({
              teacher_id: teacherId,
              student_id: studentId,
              attendance_id: attendance.id,
              compensated: false,
              compensated_by: null as any,
              valid_until: validUntil.toISOString().split("T")[0],
            });

            console.log(
              `Compensate lesson created for absent student ${studentId}, teacher ${teacherId}, attendance ${attendance.id}`
            );
          } catch (compensateError) {
            console.error(
              `Error creating compensate lesson for attendance ${attendance.id}:`,
              compensateError.message
            );
          }
        }
      } catch (error) {
        console.error(
          `Error deducting wallet/deleting transaction for teacher ${teacherId}:`,
          error.message
        );
      }
    }

    // Update the attendance record
    await attendance.update(updateAttendanceDto);

    // Handle teacher payment and create attendance log if status changed
    const newStatus = updateAttendanceDto.status || attendance.status;
    if (updateAttendanceDto.status && newStatus !== previousStatus) {
      const teacherId = updateAttendanceDto.teacher_id || attendance.teacher_id;
      const studentId = updateAttendanceDto.student_id || attendance.student_id;
      const attendanceDate = updateAttendanceDto.date || attendance.date;
      await this.handleTeacherPayment(
        teacherId,
        newStatus,
        studentId,
        attendanceDate,
        attendance.id,
        teacherId,
        previousStatus
      );
    }

    // Reload the attendance to return updated data
    return await this.findOne(id);
  }

  async remove(id: string) {
    const attendance = await this.findOne(id);

    // If the attendance status was 'present', deduct from wallet and delete transaction
    if (attendance.status === "present") {
      try {
        // Get teacher profile to check payment type
        const teacherProfile = await TeacherProfile.findOne({
          where: { user_id: attendance.teacher_id },
        });

        if (
          teacherProfile &&
          teacherProfile.payment_type === "percentage" &&
          teacherProfile.payment_value
        ) {
          // Deduct from teacher wallet
          const teacherWallet = await TeacherWallet.findOne({
            where: { teacher_id: attendance.teacher_id },
          });

          if (teacherWallet) {
            await teacherWallet.update({
              amount: teacherWallet.amount - teacherProfile.payment_value,
            });
            console.log(
              `Deducted ${teacherProfile.payment_value} from teacher ${attendance.teacher_id} wallet for removed attendance`
            );
          }

          // Delete teacher transaction for this student (most recent one)
          const transactionToDelete = await TeacherTransaction.findOne({
            where: {
              teacher_id: attendance.teacher_id,
              student_id: attendance.student_id,
            },
            order: [["created_at", "DESC"]],
          });

          if (transactionToDelete) {
            await transactionToDelete.destroy();
            console.log(
              `Deleted transaction for teacher ${attendance.teacher_id}, student ${attendance.student_id}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error deducting wallet/deleting transaction for teacher ${attendance.teacher_id}:`,
          error.message
        );
      }
    }

    // Delete all attendance logs for this attendance
    await AttendanceLog.destroy({
      where: {
        attendance_id: attendance.id,
      },
    });
    console.log(`Deleted attendance logs for attendance ${attendance.id}`);

    await attendance.destroy();
    return { id, deleted: true };
  }

  async findByGroupId(
    group_id: string,
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Attendance.findAndCountAll({
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
          where: query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${query}%` } },
                  { last_name: { [Op.like]: `%${query}%` } },
                  { username: { [Op.like]: `%${query}%` } },
                ],
              }
            : undefined,
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

  async findByStudentId(
    student_id: string,
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = { student_id };

    // Add search on status or date if query is provided
    if (query) {
      whereClause[Op.or] = [{ status: { [Op.like]: `%${query}%` } }];
    }

    const { count, rows } = await Attendance.findAndCountAll({
      where: whereClause,
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

  async findByTeacherId(
    teacher_id: string,
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Attendance.findAndCountAll({
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
          where: query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${query}%` } },
                  { last_name: { [Op.like]: `%${query}%` } },
                  { username: { [Op.like]: `%${query}%` } },
                ],
              }
            : undefined,
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
    endDate: string,
    teacher_id?: string
  ) {
    const whereClause: any = {
      student_id,
      date: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (teacher_id) {
      whereClause.teacher_id = teacher_id;
    }

    return await Attendance.findAll({
      where: whereClause,
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
