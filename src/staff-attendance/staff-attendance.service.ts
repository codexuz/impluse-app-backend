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

  async automaticScan(teacherId: string, type?: "in" | "out") {
    const now = this.getUzTime();
    const dayOfWeek = now.getUTCDay(); // Using UTC day because we manually offset now

    // Determine the days enum based on today
    const possibleDays: string[] = ["every_day"];
    if ([1, 3, 5].includes(dayOfWeek)) {
      possibleDays.push("odd");
    } else if ([2, 4, 6].includes(dayOfWeek)) {
      possibleDays.push("even");
    }

    // Find all groups for this teacher on these days
    const groups = await Group.findAll({
      where: {
        teacher_id: teacherId,
        days: { [Op.in]: possibleDays },
        isDeleted: false,
      },
    });

    if (groups.length === 0) {
      throw new NotFoundException("Bugun siz uchun darslar topilmadi");
    }

    // Find the group near the current time
    // We'll look for a group where lesson_start is within +/- 3 hours of now
    const currentTimeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    let bestGroup = null;
    let minDifference = 181; // Within 3 hours

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

    if (!bestGroup) {
      throw new NotFoundException(
        "Hozirgi vaqtga yaqin dars topilmadi (3 soat oralig'ida)",
      );
    }

    // Determine type if not provided
    let attendanceType = type;
    if (!attendanceType) {
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0");
      const day = String(now.getUTCDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;

      const lastAttendance = await StaffAttendance.findOne({
        where: {
          teacher_id: teacherId,
          date: today,
        },
        order: [["createdAt", "DESC"]],
      });

      attendanceType = lastAttendance?.type === "in" ? "out" : "in";
    }

    // Now call the existing scan logic with the found group_id
    return this.scanQrCode(teacherId, {
      group_id: bestGroup.id,
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

    // Get today's date in YYYY-MM-DD using Uzbekistan time
    const now = this.getUzTime();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    const requestedType = dto.type || "in";

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

    const attendanceType = dto.type || "in";
    
    // Default values
    let minutesLate = 0;
    let status: "early" | "on_time" | "late" = "on_time";
    let fineAmount = 0;

    // Only apply fine and delay logic for "in" type
    if (attendanceType === "in") {
      // Parse group start time
      const [startHour, startMin] = group.lesson_start.split(":").map(Number);
      const currentHour = now.getUTCHours();
      const currentMin = now.getUTCMinutes();

      const startTimeInMinutes = startHour * 60 + startMin;
      const currentTimeInMinutes = currentHour * 60 + currentMin;

      const minutesDifference = currentTimeInMinutes - startTimeInMinutes;
      
      if (minutesDifference < 0) {
        status = "early";
        minutesLate = 0;
      } else if (minutesDifference > 0) {
        status = "late";
        minutesLate = minutesDifference;
      } else {
        status = "on_time";
        minutesLate = 0;
      }

      if (status === "late") {
        if (minutesLate < 11) {
          fineAmount = 100000;
        } else {
          fineAmount = 200000;
        }
      }
    } else {
      // Logic for "out" type (optional: could check against lesson_end)
      status = "on_time"; // Default for out
      minutesLate = 0;
      fineAmount = 0;
    }

    // Create staff attendance record
    const attendance = await StaffAttendance.create({
      teacher_id: teacherId,
      group_id: dto.group_id,
      date: today,
      status,
      type: attendanceType,
      fine_amount: fineAmount,
      minutes_late: minutesLate,
      description: dto.description || (attendanceType === "in" 
        ? (status === "late" ? `${group.name} guruhiga ${minutesLate} daqiqa kechikib keldi` : (status === "early" ? `${group.name} guruhiga vaqtli keldi` : `${group.name} guruhiga o'z vaqtida keldi`))
        : `${group.name} guruhidan chiqib ketdi`),
    });

    // Process fine if applicable
    if (fineAmount > 0) {
      const jarimaDescription = dto.description || `${group.name} guruhiga ${minutesLate} daqiqa kechikib kelgani uchun jarima`;

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
}
