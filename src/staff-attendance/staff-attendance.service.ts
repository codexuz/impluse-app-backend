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
import { ScanStaffAttendanceDto } from "./dto/scan-staff-attendance.dto.js";

@Injectable()
export class StaffAttendanceService {
  async automaticScan(teacherId: string, type?: "in" | "out") {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

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
      throw new NotFoundException("No lessons found for you today");
    }

    // Find the group near the current time
    // We'll look for a group where lesson_start is within +/- 1 hour of now
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    let bestGroup = null;
    let minDifference = 61; // Within 1 hour

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
        "No group lesson near the current time (within 1 hour)",
      );
    }

    // Determine type if not provided
    let attendanceType = type;
    if (!attendanceType) {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const today = `${year}-${month}-${day}`;

      const existingIn = await StaffAttendance.findOne({
        where: {
          teacher_id: teacherId,
          group_id: bestGroup.id,
          date: today,
          type: "in",
        },
      });

      attendanceType = existingIn ? "out" : "in";
    }

    // Now call the existing scan logic with the found group_id
    return this.scanQrCode(teacherId, {
      group_id: bestGroup.id,
      type: attendanceType,
    });
  }

  async generateQrCodePayload(groupId: string) {
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new NotFoundException("Group not found");
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
      throw new NotFoundException("Group not found");
    }

    if (!group.lesson_start) {
      throw new ConflictException("Group does not have a start time defined");
    }

    // Get today's date in YYYY-MM-DD
    const now = new Date();
    // Offset by UTC +5 (Uzbekistan Time) if the server timezone is UTC.
    // For safety, let's use local date string.
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    // Check if attendance of this type already taken today
    const existingAttendance = await StaffAttendance.findOne({
      where: {
        teacher_id: teacherId,
        group_id: dto.group_id,
        date: today,
        type: dto.type || "in",
      },
    });

    if (existingAttendance) {
      throw new ConflictException(`Attendance (${dto.type || "in"}) already taken for today`);
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
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

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
        ? (status === "late" ? `Late for group ${group.name} by ${minutesLate} minutes` : (status === "early" ? `Early for group ${group.name}` : `On time for group ${group.name}`))
        : `Clocked out for group ${group.name}`),
    });

    // Process fine if applicable
    if (fineAmount > 0) {
      const jarimaDescription = dto.description || `Late for group ${group.name} by ${minutesLate} minutes`;

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
