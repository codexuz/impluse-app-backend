import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Op } from "sequelize";
import { StaffAttendance } from "./entities/staff-attendance.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { User } from "../users/entities/user.entity.js";
import { ScanStaffAttendanceDto } from "./dto/scan-staff-attendance.dto.js";

@Injectable()
export class StaffAttendanceService {
  private getUzTime(): Date {
    const now = new Date();
    // Offset for Uzbekistan (UTC +5)
    const uzTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    return uzTime;
  }

  private getToday(now: Date): string {
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fixed work start time for admins (09:00 Tashkent / UTC+5)
  private static readonly ADMIN_LESSON_START = "09:00";

  async automaticScan(teacherId: string, type?: "in" | "out") {
    const user = await User.findByPk(teacherId, {
      include: [{ association: "roles" }],
    });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    const isAdmin = (user.roles || []).some(
      (role: any) => role.name === "admin",
    );

    const now = this.getUzTime();

    // Determine type if not provided (alternate IN -> OUT)
    let attendanceType = type;
    if (!attendanceType) {
      const lastAttendance = await StaffAttendance.findOne({
        where: {
          teacher_id: teacherId,
          date: this.getToday(now),
        },
        order: [["createdAt", "DESC"]],
      });

      attendanceType = lastAttendance?.type === "in" ? "out" : "in";
    }

    // Admins check in against a fixed 09:00 Tashkent (UTC+5) start time.
    if (isAdmin) {
      return this.recordAttendance(teacherId, {
        group: null,
        lessonStart: StaffAttendanceService.ADMIN_LESSON_START,
        type: attendanceType,
        isAdmin: true,
      });
    }

    // Teachers: find today's groups (no time-window restriction).
    const dayOfWeek = now.getUTCDay(); // Using UTC day because we manually offset now
    const possibleDays: string[] = ["every_day"];
    if ([1, 3, 5].includes(dayOfWeek)) {
      possibleDays.push("odd");
    } else if ([2, 4, 6].includes(dayOfWeek)) {
      possibleDays.push("even");
    }

    const groups = await Group.findAll({
      where: {
        teacher_id: teacherId,
        days: { [Op.in]: possibleDays },
        isDeleted: false,
      },
    });

    // Pick the group whose lesson_start is closest to now (no 3-hour limit).
    let bestGroup: Group | null = null;
    if (groups.length > 0) {
      const currentTimeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
      let minDifference = Infinity;

      for (const group of groups) {
        if (!group.lesson_start) continue;

        const [startHour, startMin] = group.lesson_start.split(":").map(Number);
        const startTimeInMinutes = startHour * 60 + startMin;
        const diff = Math.abs(currentTimeInMinutes - startTimeInMinutes);

        if (diff < minDifference) {
          minDifference = diff;
          bestGroup = group;
        }
      }
    }

    // If the teacher has a group today, take attendance against it.
    // Otherwise let them check in early (no group, no fine).
    return this.recordAttendance(teacherId, {
      group: bestGroup,
      lessonStart: bestGroup ? bestGroup.lesson_start : null,
      type: attendanceType,
    });
  }

  async generateStaticTeacherQrCode(teacherId: string) {
    const teacher = await User.findByPk(teacherId);
    if (!teacher) {
      throw new NotFoundException("O'qituvchi topilmadi");
    }
    return {
      teacher_id: teacherId,
      bot_url: `https://t.me/staff_attendanceBot?start=${teacherId}`
    };
  }

  async generateQrCodePayload(groupId: string) {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new NotFoundException("Guruh topilmadi");
    }
    // Return a payload that can be encoded into a QR code.
    // For simplicity, we just return the group ID.
    // In a more secure system, this could be a signed token.
    return {
      group_id: groupId,
      group_name: group.name,
      lesson_start: group.lesson_start,
      timestamp: new Date().toISOString(),
    };
  }

  async scanQrCode(teacherId: string, dto: ScanStaffAttendanceDto) {
    const group = await Group.findByPk(dto.group_id);

    if (!group) {
      throw new NotFoundException("Guruh topilmadi");
    }

    if (!group.lesson_start) {
      throw new ConflictException("Guruhning dars boshlanish vaqti belgilanmagan");
    }

    return this.recordAttendance(teacherId, {
      group,
      lessonStart: group.lesson_start,
      type: dto.type,
      description: dto.description,
    });
  }

  /**
   * Shared attendance recording logic for QR scans, teachers and admins.
   *
   * - `lessonStart` ("HH:MM") is the reference time used to compute lateness.
   *   When it is null (e.g. a teacher without a group today) an "in" check-in
   *   is always recorded as "early" with no fine.
   * - `group` is null for admins and group-less teacher check-ins.
   */
  private async recordAttendance(
    teacherId: string,
    options: {
      group: Group | null;
      lessonStart: string | null;
      type?: "in" | "out";
      description?: string;
      isAdmin?: boolean;
    },
  ) {
    const { group, lessonStart, description, isAdmin } = options;

    // Get today's date in YYYY-MM-DD using Uzbekistan time
    const now = this.getUzTime();
    const today = this.getToday(now);

    const requestedType = options.type || "in";

    // Check how many of this type already taken today
    const typeCount = await StaffAttendance.count({
      where: {
        teacher_id: teacherId,
        date: today,
        type: requestedType,
      },
    });

    if (typeCount >= 2) {
      throw new ConflictException(
        `Bugun uchun davomat (${requestedType === "in" ? "kirish" : "chiqish"}) allaqachon 2 marta olingan`,
      );
    }

    // Check sequence to ensure IN -> OUT -> IN -> OUT
    const lastAttendance = await StaffAttendance.findOne({
      where: {
        teacher_id: teacherId,
        date: today,
      },
      order: [["createdAt", "DESC"]],
    });

    if (lastAttendance) {
      if (lastAttendance.type === requestedType) {
        throw new ConflictException(
          `Oxirgi davomat allaqachon "${requestedType === "in" ? "kirish" : "chiqish"}" bo'lgan. Avval ${
            requestedType === "in" ? "chiqish" : "kirish"
          } qilishingiz kerak.`,
        );
      }
    } else {
      if (requestedType === "out") {
        throw new ConflictException(
          "Bugun avval kirish qilmasdan turib chiqish qila olmaysiz.",
        );
      }
    }

    // Default values
    let minutesLate = 0;
    let status: "early" | "on_time" | "late" = "on_time";
    let fineAmount = 0;

    // Only apply fine and delay logic for "in" type against a reference time
    if (requestedType === "in" && lessonStart) {
      const [startHour, startMin] = lessonStart.split(":").map(Number);
      const startTimeInMinutes = startHour * 60 + startMin;
      const currentTimeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

      const minutesDifference = currentTimeInMinutes - startTimeInMinutes;

      if (minutesDifference < 0) {
        status = "early";
      } else if (minutesDifference > 0) {
        status = "late";
        minutesLate = minutesDifference;
        fineAmount = minutesLate < 11 ? 100000 : 200000;
      } else {
        status = "on_time";
      }
    } else if (requestedType === "in") {
      // No reference time (e.g. teacher without a group) -> early, no fine
      status = "early";
    }
    // "out" type stays on_time with no fine

    const arrivalPrefix = group ? `${group.name} guruhiga` : "Ishga";
    const departurePrefix = group ? `${group.name} guruhidan` : "Ishdan";

    const defaultDescription =
      requestedType === "in"
        ? status === "late"
          ? `${arrivalPrefix} ${minutesLate} daqiqa kechikib keldi`
          : status === "early"
            ? `${arrivalPrefix} vaqtli keldi`
            : `${arrivalPrefix} o'z vaqtida keldi`
        : `${departurePrefix} chiqib ketdi`;

    // Create staff attendance record
    const attendance = await StaffAttendance.create({
      teacher_id: teacherId,
      group_id: group ? group.id : null,
      date: today,
      status,
      type: requestedType,
      fine_amount: fineAmount,
      minutes_late: minutesLate,
      description: description || defaultDescription,
    } as any);

    // Process fine if applicable.
    // Admins have no wallet: the fine_amount is stored on the attendance record
    // above, but no transaction is created and nothing is deducted.
    if (fineAmount > 0 && !isAdmin) {
      const jarimaDescription =
        description ||
        `${arrivalPrefix} ${minutesLate} daqiqa kechikib kelgani uchun jarima`;

      // Create teacher transaction for the fine
      await TeacherTransaction.create({
        teacher_id: teacherId,
        amount: fineAmount,
        type: "jarima",
        description: jarimaDescription,
      } as any);

      // Find or create teacher wallet and deduct the fine amount
      let teacherWallet = await TeacherWallet.findOne({
        where: { teacher_id: teacherId },
      });

      if (!teacherWallet) {
        teacherWallet = await TeacherWallet.create({
          teacher_id: teacherId,
          amount: -fineAmount,
        });
      } else {
        await teacherWallet.update({
          amount: teacherWallet.amount - fineAmount,
        });
      }
    }

    return attendance;
  }

  async getTeacherAttendances(teacherId: string) {
    return StaffAttendance.findAll({
      where: { teacher_id: teacherId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "group",
          attributes: ["id", "name", "lesson_start"],
        },
      ],
    });
  }

  async getAllAttendances(options: {
    page?: number;
    limit?: number;
    query?: string;
    teacherId?: string;
    groupId?: string;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (options.teacherId) whereClause.teacher_id = options.teacherId;
    if (options.groupId) whereClause.group_id = options.groupId;
    if (options.status) whereClause.status = options.status;
    if (options.type) whereClause.type = options.type;

    if (options.startDate && options.endDate) {
      whereClause.date = { [Op.between]: [options.startDate, options.endDate] };
    } else if (options.startDate) {
      whereClause.date = { [Op.gte]: options.startDate };
    } else if (options.endDate) {
      whereClause.date = { [Op.lte]: options.endDate };
    }

    const { count, rows } = await StaffAttendance.findAndCountAll({
      where: whereClause,
      order: [
        ["date", "DESC"],
        ["createdAt", "DESC"],
      ],
      include: [
        {
          association: "teacher",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
          where: options.query
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${options.query}%` } },
                  { last_name: { [Op.like]: `%${options.query}%` } },
                  { username: { [Op.like]: `%${options.query}%` } },
                ],
              }
            : undefined,
        },
        {
          association: "group",
          attributes: ["id", "name", "lesson_start"],
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
}
