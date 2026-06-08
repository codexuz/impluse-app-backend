import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Op } from "sequelize";
import { StaffAttendance } from "./entities/staff-attendance.entity.js";
import { AttendancePolicy } from "./entities/attendance-policy.entity.js";
import { StaffAttendanceEvent } from "./entities/staff-attendance-event.entity.js";
import { StaffPermission } from "./entities/staff-permission.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { User } from "../users/entities/user.entity.js";
import { StaffProfile } from "../staff-profile/entities/staff-profile.entity.js";
import { StaffShift } from "../staff-profile/entities/staff-shift.entity.js";
import { StaffProfileService } from "../staff-profile/staff-profile.service.js";
import { ScanStaffAttendanceDto } from "./dto/scan-staff-attendance.dto.js";
import { CreateStaffPermissionDto } from "./dto/create-staff-permission.dto.js";
import { ReviewStaffPermissionDto } from "./dto/review-staff-permission.dto.js";

@Injectable()
export class StaffAttendanceService {
  constructor(private readonly staffProfileService: StaffProfileService) {}

  private getUzTime(): Date {
    const now = new Date();
    return new Date(now.getTime() + 5 * 60 * 60 * 1000);
  }

  private getToday(now: Date): string {
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private static readonly ADMIN_LESSON_START = "09:00";

  // ---------------------------------------------------------------------------
  // Policy engine
  // ---------------------------------------------------------------------------

  private async resolvePolicy(
    branchId?: string | null,
    role?: string | null,
  ): Promise<AttendancePolicy> {
    const today = this.getToday(this.getUzTime());

    const candidates = await AttendancePolicy.findAll({
      where: {
        is_active: true,
        [Op.or]: [{ effective_from: null }, { effective_from: { [Op.lte]: today } }],
        [Op.and]: [
          { [Op.or]: [{ effective_to: null }, { effective_to: { [Op.gte]: today } }] },
        ],
      },
      order: [
        // Most specific first: matching branch + role
        ["branch_id", "DESC"],
        ["role", "DESC"],
      ],
    });

    // Pick best match: branch+role > branch-only > role-only > global
    const score = (p: AttendancePolicy) => {
      let s = 0;
      if (p.branch_id && p.branch_id === branchId) s += 2;
      if (p.role && p.role === role) s += 1;
      if (p.branch_id && p.branch_id !== branchId) s = -99;
      return s;
    };

    const sorted = candidates.sort((a, b) => score(b) - score(a));
    if (sorted.length > 0) return sorted[0];

    // Fallback: synthetic default matching current hardcoded values
    return AttendancePolicy.build({
      grace_period_minutes: 0,
      fine_tier1_amount: 100000,
      fine_tier1_max_minutes: 10,
      fine_tier2_amount: 200000,
      max_fine_per_day: 0,
    });
  }

  private computeFine(
    minutesLate: number,
    policy: AttendancePolicy,
  ): number {
    if (minutesLate <= 0) return 0;
    const effective = minutesLate - policy.grace_period_minutes;
    if (effective <= 0) return 0;
    const raw =
      effective <= policy.fine_tier1_max_minutes
        ? policy.fine_tier1_amount
        : policy.fine_tier2_amount;
    if (policy.max_fine_per_day > 0) return Math.min(raw, policy.max_fine_per_day);
    return raw;
  }

  // ---------------------------------------------------------------------------
  // Permission (ruxsat) engine
  // ---------------------------------------------------------------------------

  /**
   * Returns the approved permission covering `date` for this staff member, if any.
   * When `type` is given, only that permission type is considered.
   */
  private async findActivePermission(
    staffId: string,
    date: string,
    type?: StaffPermission["type"],
  ): Promise<StaffPermission | null> {
    return StaffPermission.findOne({
      where: {
        staff_id: staffId,
        status: "approved",
        start_date: { [Op.lte]: date },
        end_date: { [Op.gte]: date },
        ...(type ? { type } : {}),
      },
      order: [["createdAt", "DESC"]],
    });
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  // ---------------------------------------------------------------------------
  // Audit log helpers
  // ---------------------------------------------------------------------------

  private async logEvent(opts: {
    staffId: string;
    attendanceId: string | null;
    method: StaffAttendanceEvent["method"];
    type: StaffAttendanceEvent["type"];
    outcome: StaffAttendanceEvent["outcome"];
    note?: string;
    rawPayload?: object;
  }) {
    await StaffAttendanceEvent.create({
      staff_id: opts.staffId,
      attendance_id: opts.attendanceId,
      method: opts.method,
      type: opts.type,
      outcome: opts.outcome,
      note: opts.note ?? null,
      raw_payload: opts.rawPayload ?? null,
    } as any);
  }

  // ---------------------------------------------------------------------------
  // Shift resolution helpers
  // ---------------------------------------------------------------------------

  /**
   * For check-in  → pick shift closest to NOW (current time).
   * For check-out → pick shift closest to today's check-in time so we don't
   *                 accidentally match the next shift that has started by the
   *                 time the user walks out.
   */
  private async resolveShiftForScan(
    teacherId: string,
    today: string,
    jsDay: number,
    nowMinutes: number,
    scanType: "in" | "out",
  ) {
    const shifts = await this.staffProfileService.resolveShiftsForDay(teacherId, jsDay);
    if (shifts.length === 0) return null;

    if (scanType === "out") {
      // Find today's check-in record to anchor the shift lookup
      const checkIn = await StaffAttendance.findOne({
        where: { teacher_id: teacherId, date: today, type: "in" },
        order: [["createdAt", "ASC"]],
      });
      if (checkIn) {
        // Use the check-in timestamp (UZ time) as the anchor
        const checkInUz = new Date(checkIn.createdAt.getTime() + 5 * 60 * 60 * 1000);
        const checkInMinutes = checkInUz.getUTCHours() * 60 + checkInUz.getUTCMinutes();
        return this.staffProfileService.pickClosestShift(shifts, checkInMinutes);
      }
    }

    // For check-in (or no prior check-in found) use current time
    return this.staffProfileService.pickClosestShift(shifts, nowMinutes);
  }

  // ---------------------------------------------------------------------------
  // Public scan methods
  // ---------------------------------------------------------------------------

  async automaticScan(teacherId: string, type?: "in" | "out") {
    const user = await User.findByPk(teacherId, {
      include: [{ association: "roles" }],
    });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    const roleNames = (user.roles || []).map((r: any) => r.name as string);
    const isTeacher = roleNames.includes("teacher");

    const now = this.getUzTime();
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const today = this.getToday(now);

    let attendanceType = type;
    if (!attendanceType) {
      const last = await StaffAttendance.findOne({
        where: { teacher_id: teacherId, date: today },
        order: [["createdAt", "DESC"]],
      });
      attendanceType = last?.type === "in" ? "out" : "in";
    }

    // Resolve shift — anchors to check-in time for checkout to avoid cross-shift confusion
    const shift = await this.resolveShiftForScan(teacherId, today, now.getUTCDay(), nowMinutes, attendanceType);

    // If shift found — use it for everyone, no group needed
    if (shift) {
      return this.recordAttendance(teacherId, {
        group: null,
        lessonStart: shift.in_time,
        outTime: shift.out_time ?? null,
        gracePeriod: shift.grace_period_minutes,
        shiftId: shift.id,
        type: attendanceType,
        method: "auto_scan",
      });
    }

    // No shift: teachers fall back to their closest group lesson time
    if (isTeacher) {
      const dayOfWeek = now.getUTCDay();
      const possibleDays: string[] = ["every_day"];
      if ([1, 3, 5].includes(dayOfWeek)) possibleDays.push("odd");
      else if ([2, 4, 6].includes(dayOfWeek)) possibleDays.push("even");

      const groups = await Group.findAll({
        where: { teacher_id: teacherId, days: { [Op.in]: possibleDays }, isDeleted: false },
      });

      let bestGroup: Group | null = null;
      let minDiff = Infinity;
      for (const g of groups) {
        if (!g.lesson_start) continue;
        const [h, m] = g.lesson_start.split(":").map(Number);
        const diff = Math.abs(nowMinutes - (h * 60 + m));
        if (diff < minDiff) { minDiff = diff; bestGroup = g; }
      }

      const isCheckOut = attendanceType === "out";
      return this.recordAttendance(teacherId, {
        group: isCheckOut ? null : bestGroup,
        lessonStart: isCheckOut ? null : (bestGroup?.lesson_start ?? null),
        outTime: null,
        gracePeriod: 0,
        type: attendanceType,
        method: "auto_scan",
      });
    }

    // Non-teacher with no shift — use default admin lesson start
    return this.recordAttendance(teacherId, {
      group: null,
      lessonStart: StaffAttendanceService.ADMIN_LESSON_START,
      outTime: null,
      gracePeriod: 0,
      type: attendanceType,
      method: "auto_scan",
    });
  }

  async generateStaticTeacherQrCode(teacherId: string) {
    const teacher = await User.findByPk(teacherId);
    if (!teacher) throw new NotFoundException("O'qituvchi topilmadi");
    return {
      teacher_id: teacherId,
      bot_url: `https://t.me/staff_attendanceBot?start=${teacherId}`,
    };
  }

  async generateQrCodePayload(groupId: string) {
    const group = await Group.findByPk(groupId);
    if (!group) throw new NotFoundException("Guruh topilmadi");
    return {
      group_id: groupId,
      group_name: group.name,
      lesson_start: group.lesson_start,
      timestamp: new Date().toISOString(),
    };
  }

  async scanQrCode(teacherId: string, dto: ScanStaffAttendanceDto) {
    const group = await Group.findByPk(dto.group_id);
    if (!group) throw new NotFoundException("Guruh topilmadi");
    if (!group.lesson_start) {
      throw new ConflictException("Guruhning dars boshlanish vaqti belgilanmagan");
    }

    const now = this.getUzTime();
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const today = this.getToday(now);
    const scanType = dto.type ?? "in";
    const shift = await this.resolveShiftForScan(teacherId, today, now.getUTCDay(), nowMinutes, scanType);

    // Shift takes priority; group lesson_start is the fallback
    return this.recordAttendance(teacherId, {
      group: shift ? null : group,
      lessonStart: shift ? shift.in_time : group.lesson_start,
      outTime: shift ? (shift.out_time ?? null) : null,
      gracePeriod: shift ? shift.grace_period_minutes : 0,
      shiftId: shift ? shift.id : null,
      type: dto.type,
      description: dto.description,
      method: "qr_scan",
      rawPayload: { group_id: dto.group_id, type: dto.type },
    });
  }

  // ---------------------------------------------------------------------------
  // Core recording logic
  // ---------------------------------------------------------------------------

  private async recordAttendance(
    teacherId: string,
    options: {
      group: Group | null;
      lessonStart: string | null;
      outTime?: string | null;
      gracePeriod?: number;
      shiftId?: string | null;
      type?: "in" | "out";
      description?: string;
      isAdmin?: boolean;
      method?: StaffAttendanceEvent["method"];
      rawPayload?: object;
    },
  ) {
    const { group, lessonStart, outTime, description, isAdmin } = options;
    const method = options.method ?? "manual";
    const now = this.getUzTime();
    const today = this.getToday(now);
    const requestedType = options.type ?? "in";

    // Sequence validation
    const typeCount = await StaffAttendance.count({
      where: { teacher_id: teacherId, date: today, type: requestedType },
    });

    if (typeCount >= 2) {
      const note = `Bugun uchun davomat (${requestedType === "in" ? "kirish" : "chiqish"}) allaqachon 2 marta olingan`;
      await this.logEvent({ staffId: teacherId, attendanceId: null, method, type: requestedType, outcome: "rejected", note });
      throw new ConflictException(note);
    }

    const lastAttendance = await StaffAttendance.findOne({
      where: { teacher_id: teacherId, date: today },
      order: [["createdAt", "DESC"]],
    });

    if (lastAttendance) {
      if (lastAttendance.type === requestedType) {
        const note = `Oxirgi davomat allaqachon "${requestedType === "in" ? "kirish" : "chiqish"}" bo'lgan.`;
        await this.logEvent({ staffId: teacherId, attendanceId: null, method, type: requestedType, outcome: "rejected", note });
        throw new ConflictException(note);
      }
    } else if (requestedType === "out") {
      const note = "Bugun avval kirish qilmasdan turib chiqish qila olmaysiz.";
      await this.logEvent({ staffId: teacherId, attendanceId: null, method, type: requestedType, outcome: "rejected", note });
      throw new ConflictException(note);
    }

    // Resolve fine policy — shift grace period takes precedence over policy grace period
    const user = await User.findByPk(teacherId, { include: [{ association: "roles" }] });
    const roleName = (user?.roles || []).map((r: any) => r.name).join(",");
    const policy = await this.resolvePolicy(null, roleName);
    const effectiveGrace = options.gracePeriod ?? policy.grace_period_minutes;

    // Approved permission (ruxsat) covering today, if any
    const permission = await this.findActivePermission(teacherId, today);
    let permissionId: string | null = null;

    let minutesLate = 0;
    let status: "early" | "on_time" | "late" | "excused" = "on_time";
    let fineAmount = 0;

    const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();

    if (requestedType === "in") {
      if (permission && permission.type === "full_day") {
        // Excused absence — no lateness or fine even if they do check in
        status = "excused";
        permissionId = permission.id;
      } else if (lessonStart) {
        let startMin = this.toMinutes(lessonStart);
        const isLateArrival =
          permission?.type === "late_arrival" && !!permission.permitted_time;
        if (isLateArrival) {
          permissionId = permission!.id;
          // The excused arrival time replaces the shift start for lateness
          startMin = Math.max(startMin, this.toMinutes(permission!.permitted_time!));
        }
        const diff = nowMin - startMin;

        if (diff < 0) {
          status = isLateArrival ? "excused" : "early";
        } else if (diff > 0) {
          minutesLate = diff;
          const effectiveLate = minutesLate - effectiveGrace;
          if (effectiveLate > 0) {
            // Late beyond the (possibly permission-extended) start → fined
            status = "late";
            // Pass a policy clone with the effective grace so computeFine is consistent
            fineAmount = this.computeFine(minutesLate, { ...policy.toJSON(), grace_period_minutes: effectiveGrace } as any);
          } else {
            status = isLateArrival ? "excused" : "on_time";
          }
        } else {
          status = isLateArrival ? "excused" : "on_time";
        }
      } else {
        status = "early";
      }
    } else if (requestedType === "out" && outTime) {
      const outMin = this.toMinutes(outTime);
      if (nowMin < outMin) {
        // Early checkout — excused if an approved early_leave permission covers it
        if (
          permission?.type === "early_leave" &&
          (!permission.permitted_time || nowMin >= this.toMinutes(permission.permitted_time))
        ) {
          status = "excused";
          permissionId = permission.id;
        } else {
          status = "early";
        }
      } else {
        status = "on_time";
      }
    }

    const arrivalPrefix = group ? `${group.name} guruhiga` : "Ishga";
    const departurePrefix = group ? `${group.name} guruhidan` : "Ishdan";

    const defaultDescription =
      requestedType === "in"
        ? status === "excused"
          ? `${arrivalPrefix} ruxsat bilan keldi`
          : status === "late"
            ? `${arrivalPrefix} ${minutesLate} daqiqa kechikib keldi`
            : status === "early"
              ? `${arrivalPrefix} vaqtli keldi`
              : `${arrivalPrefix} o'z vaqtida keldi`
        : status === "excused"
          ? `${departurePrefix} ruxsat bilan erta chiqdi`
          : status === "early"
            ? `${departurePrefix} erta chiqib ketdi`
            : `${departurePrefix} chiqib ketdi`;

    const attendance = await StaffAttendance.create({
      teacher_id: teacherId,
      group_id: group ? group.id : null,
      shift_id: options.shiftId ?? null,
      date: today,
      status,
      type: requestedType,
      fine_amount: fineAmount,
      minutes_late: minutesLate,
      permission_id: permissionId,
      description: description || defaultDescription,
    } as any);

    await this.logEvent({
      staffId: teacherId,
      attendanceId: attendance.id,
      method,
      type: requestedType,
      outcome: "success",
      rawPayload: options.rawPayload,
    });

    if (fineAmount > 0 && !isAdmin) {
      const jarimaDescription =
        description || `${arrivalPrefix} ${minutesLate} daqiqa kechikib kelgani uchun jarima`;

      await TeacherTransaction.create({
        teacher_id: teacherId,
        amount: fineAmount,
        type: "jarima",
        description: jarimaDescription,
      } as any);

      let wallet = await TeacherWallet.findOne({ where: { teacher_id: teacherId } });
      if (!wallet) {
        await TeacherWallet.create({ teacher_id: teacherId, amount: -fineAmount });
      } else {
        await wallet.update({ amount: wallet.amount - fineAmount });
      }
    }

    return attendance;
  }

  // ---------------------------------------------------------------------------
  // Cron: dynamic per-shift absence marking
  // ---------------------------------------------------------------------------

  /**
   * Minutes after a shift's (grace-adjusted) start time before a no-show is
   * auto-marked absent. The shift's own `grace_period_minutes` is added on top.
   */
  private static readonly ABSENT_GRACE_MINUTES = 30;

  /**
   * Runs every 5 minutes and evaluates **each staff member's shifts that apply
   * today**, resolved from staff_profile → staff_shift (`day_of_week`, `in_time`,
   * `out_time`). Unlike the old fixed 09:30 job, every shift is judged on its own
   * `in_time`, so afternoon / evening shifts are handled too.
   *
   * A shift is auto-marked absent once `in_time + grace + ABSENT_GRACE` has passed
   * and no matching check-in exists. Approved staff_permissions are honoured via
   * `start_date`/`end_date`/`permitted_time`:
   *   - full_day     → excused record, no fine
   *   - late_arrival → deadline pushed to `permitted_time` (still absent if a no-show)
   *   - early_leave  → ignored here (affects checkout, not arrival)
   *
   * Idempotent: every record carries the `shift_id` it belongs to, so a shift
   * already covered by a check-in or a prior absent row is skipped — re-runs
   * never double-mark or double-fine, and a missing checkout on one shift can
   * never spill over into a false absence on another.
   */
  @Cron("0 */5 * * * *")
  async processShiftAbsences() {
    const now = this.getUzTime();
    const today = this.getToday(now);
    const jsDay = now.getUTCDay();
    const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();

    const profiles = await StaffProfile.findAll({
      include: [
        { association: "staff", required: true, include: [{ association: "roles" }] },
      ],
    });

    for (const profile of profiles) {
      const staffId = profile.staff_id;

      // Shifts that apply to this staff member today (day_of_week resolution).
      const shifts = await this.staffProfileService.resolveShiftsForDay(staffId, jsDay);
      if (shifts.length === 0) continue;

      // Shifts already handled today: any "in" record (real check-in or a prior
      // auto-absent row) stamps the shift_id it belongs to.
      const inRecords = await StaffAttendance.findAll({
        where: { teacher_id: staffId, date: today, type: "in" },
        attributes: ["shift_id"],
      });
      const coveredShiftIds = new Set<string>();
      for (const rec of inRecords) {
        if (rec.shift_id) coveredShiftIds.add(rec.shift_id);
      }

      // Approved permission (ruxsat) covering today, if any.
      const permission = await this.findActivePermission(staffId, today);
      const roleNames = ((profile.staff as any)?.roles || []).map((r: any) => r.name as string);
      const isTeacher = roleNames.includes("teacher");

      for (const shift of shifts) {
        if (coveredShiftIds.has(shift.id)) continue;

        // Grace-adjusted deadline, extended by a late_arrival permission.
        let startMin = this.toMinutes(shift.in_time) + (shift.grace_period_minutes ?? 0);
        if (permission?.type === "late_arrival" && permission.permitted_time) {
          startMin = Math.max(startMin, this.toMinutes(permission.permitted_time));
        }
        const deadline = startMin + StaffAttendanceService.ABSENT_GRACE_MINUTES;
        if (nowMin < deadline) continue; // shift window hasn't elapsed yet today

        if (permission?.type === "full_day") {
          await this.markShiftAbsent(staffId, today, shift, { excusedBy: permission.id });
        } else {
          await this.markShiftAbsent(staffId, today, shift, { isTeacher });
        }
        // Prevent double-processing if the same staff has overlapping shifts.
        coveredShiftIds.add(shift.id);
      }
    }
  }

  /**
   * Creates the absence record for a single missed shift. When `excusedBy` is set
   * the record is "excused" with no fine; otherwise it is a fined no-show (fine
   * pulled from the active policy, teachers only since they carry a wallet).
   */
  private async markShiftAbsent(
    staffId: string,
    today: string,
    shift: StaffShift,
    opts: { excusedBy?: string; isTeacher?: boolean },
  ) {
    if (opts.excusedBy) {
      const excused = await StaffAttendance.create({
        teacher_id: staffId,
        group_id: null,
        shift_id: shift.id,
        date: today,
        status: "excused",
        type: "in",
        fine_amount: 0,
        minutes_late: 0,
        permission_id: opts.excusedBy,
        description: `Ruxsat bilan kelmadi (${shift.in_time} smenasi, avtomatik)`,
      } as any);
      await this.logEvent({
        staffId,
        attendanceId: excused.id,
        method: "cron_absent",
        type: "absent",
        outcome: "success",
        note: "Excused by approved permission",
      });
      return;
    }

    // Absence fine resolved from the active policy (tier-2 = severe), teachers only.
    const user = await User.findByPk(staffId, { include: [{ association: "roles" }] });
    const roleName = (user?.roles || []).map((r: any) => r.name).join(",");
    const policy = await this.resolvePolicy(null, roleName);
    const absenceFine = opts.isTeacher ? policy.fine_tier2_amount : 0;

    const absent = await StaffAttendance.create({
      teacher_id: staffId,
      group_id: null,
      shift_id: shift.id,
      date: today,
      status: "late",
      type: "in",
      fine_amount: absenceFine,
      minutes_late: 0,
      description: `Ishga kelmadi (${shift.in_time} smenasi, avtomatik belgilandi)`,
    } as any);

    if (absenceFine > 0) {
      await TeacherTransaction.create({
        teacher_id: staffId,
        amount: absenceFine,
        type: "jarima",
        description: "Ruxsatsiz ishga kelmagani uchun jarima",
      } as any);

      const wallet = await TeacherWallet.findOne({ where: { teacher_id: staffId } });
      if (!wallet) {
        await TeacherWallet.create({ teacher_id: staffId, amount: -absenceFine });
      } else {
        await wallet.update({ amount: wallet.amount - absenceFine });
      }
    }

    await this.logEvent({
      staffId,
      attendanceId: absent.id,
      method: "cron_absent",
      type: "absent",
      outcome: "success",
      note: "Auto-marked absent by cron job",
    });
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  async getTeacherAttendances(teacherId: string) {
    return StaffAttendance.findAll({
      where: { teacher_id: teacherId },
      order: [["createdAt", "DESC"]],
      include: [{ association: "group", attributes: ["id", "name", "lesson_start"] }],
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

    const where: any = {};
    if (options.teacherId) where.teacher_id = options.teacherId;
    if (options.groupId) where.group_id = options.groupId;
    if (options.status) where.status = options.status;
    if (options.type) where.type = options.type;

    if (options.startDate && options.endDate) {
      where.date = { [Op.between]: [options.startDate, options.endDate] };
    } else if (options.startDate) {
      where.date = { [Op.gte]: options.startDate };
    } else if (options.endDate) {
      where.date = { [Op.lte]: options.endDate };
    }

    const { count, rows } = await StaffAttendance.findAndCountAll({
      where,
      order: [["date", "DESC"], ["createdAt", "DESC"]],
      include: [
        {
          association: "teacher",
          attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
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
        { association: "group", attributes: ["id", "name", "lesson_start"] },
      ],
      limit,
      offset,
      distinct: true,
    });

    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  async getSummary(options: {
    startDate: string;
    endDate: string;
    teacherId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.min(100, Math.max(1, options.limit ?? 20));

    const where: any = {
      date: { [Op.between]: [options.startDate, options.endDate] },
      type: "in",
    };
    if (options.teacherId) where.teacher_id = options.teacherId;

    const rows = await StaffAttendance.findAll({
      where,
      attributes: [
        "teacher_id",
        "status",
        [StaffAttendance.sequelize!.fn("COUNT", StaffAttendance.sequelize!.col("id")), "count"],
        [StaffAttendance.sequelize!.fn("SUM", StaffAttendance.sequelize!.col("fine_amount")), "total_fine"],
        [StaffAttendance.sequelize!.fn("AVG", StaffAttendance.sequelize!.col("minutes_late")), "avg_minutes_late"],
      ],
      group: ["teacher_id", "status"],
      include: [
        {
          association: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
      ],
    });

    // Aggregate per teacher
    const byTeacher: Record<string, any> = {};
    for (const row of rows) {
      const r = row.toJSON() as any;
      const id = r.teacher_id;
      if (!byTeacher[id]) {
        byTeacher[id] = {
          teacher: r.teacher,
          early: 0,
          on_time: 0,
          late: 0,
          total_fine: 0,
          avg_minutes_late: 0,
          total: 0,
        };
      }
      const cnt = Number(r.count);
      byTeacher[id][r.status] += cnt;
      byTeacher[id].total += cnt;
      byTeacher[id].total_fine += Number(r.total_fine ?? 0);
      if (r.status === "late") {
        byTeacher[id].avg_minutes_late = Number(r.avg_minutes_late ?? 0);
      }
    }

    const allItems = Object.values(byTeacher).map((t) => ({
      ...t,
      attendance_rate: t.total > 0 ? (((t.on_time + t.early) / t.total) * 100).toFixed(1) : "0.0",
    }));

    const total = allItems.length;
    const offset = (page - 1) * limit;
    const data = allItems.slice(offset, offset + limit);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ---------------------------------------------------------------------------
  // Policy CRUD (admin)
  // ---------------------------------------------------------------------------

  async getPolicies(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await AttendancePolicy.findAndCountAll({
      where: { is_active: true },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async createPolicy(data: Partial<AttendancePolicy>) {
    return AttendancePolicy.create(data as any);
  }

  async updatePolicy(id: string, data: Partial<AttendancePolicy>) {
    const policy = await AttendancePolicy.findByPk(id);
    if (!policy) throw new NotFoundException("Policy topilmadi");
    return policy.update(data);
  }

  async deletePolicy(id: string) {
    const policy = await AttendancePolicy.findByPk(id);
    if (!policy) throw new NotFoundException("Policy topilmadi");
    await policy.update({ is_active: false });
    return { message: "Policy o'chirildi" };
  }

  // ---------------------------------------------------------------------------
  // Permissions / leave (ruxsat) CRUD
  // ---------------------------------------------------------------------------

  async createPermission(dto: CreateStaffPermissionDto, requestedBy?: string) {
    const staff = await User.findByPk(dto.staff_id);
    if (!staff) throw new NotFoundException("Xodim topilmadi");

    const endDate = dto.end_date ?? dto.start_date;
    if (endDate < dto.start_date) {
      throw new ConflictException("end_date start_date dan oldin bo'lishi mumkin emas");
    }
    if (dto.type !== "full_day" && !dto.permitted_time) {
      throw new ConflictException(
        "late_arrival va early_leave uchun permitted_time majburiy",
      );
    }

    return StaffPermission.create({
      staff_id: dto.staff_id,
      type: dto.type,
      start_date: dto.start_date,
      end_date: endDate,
      permitted_time: dto.type === "full_day" ? null : dto.permitted_time ?? null,
      reason: dto.reason ?? null,
      status: "pending",
      requested_by: requestedBy ?? null,
    } as any);
  }

  async reviewPermission(id: string, dto: ReviewStaffPermissionDto, reviewerId?: string) {
    const permission = await StaffPermission.findByPk(id);
    if (!permission) throw new NotFoundException("Ruxsat topilmadi");

    return permission.update({
      status: dto.status,
      review_note: dto.review_note ?? null,
      reviewed_by: reviewerId ?? null,
      reviewed_at: new Date(),
    });
  }

  async updatePermission(id: string, dto: Partial<CreateStaffPermissionDto>) {
    const permission = await StaffPermission.findByPk(id);
    if (!permission) throw new NotFoundException("Ruxsat topilmadi");
    if (permission.status !== "pending") {
      throw new ConflictException("Faqat ko'rib chiqilmagan ruxsatni tahrirlash mumkin");
    }
    const next: any = { ...dto };
    if (dto.start_date && !dto.end_date) next.end_date = dto.start_date;
    return permission.update(next);
  }

  async deletePermission(id: string) {
    const permission = await StaffPermission.findByPk(id);
    if (!permission) throw new NotFoundException("Ruxsat topilmadi");
    await permission.destroy();
    return { message: "Ruxsat o'chirildi" };
  }

  async getStaffPermissions(staffId: string) {
    return StaffPermission.findAll({
      where: { staff_id: staffId },
      order: [["start_date", "DESC"], ["createdAt", "DESC"]],
    });
  }

  async getPermissions(options: {
    page?: number;
    limit?: number;
    staffId?: string;
    status?: string;
    type?: string;
    date?: string;
  }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (options.staffId) where.staff_id = options.staffId;
    if (options.status) where.status = options.status;
    if (options.type) where.type = options.type;
    if (options.date) {
      where.start_date = { [Op.lte]: options.date };
      where.end_date = { [Op.gte]: options.date };
    }

    const { count, rows } = await StaffPermission.findAndCountAll({
      where,
      order: [["start_date", "DESC"], ["createdAt", "DESC"]],
      include: [
        {
          association: "staff",
          attributes: ["user_id", "first_name", "last_name", "username", "avatar_url"],
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  // Audit log
  async getAttendanceEvents(staffId?: string, limit = 50) {
    const where: any = {};
    if (staffId) where.staff_id = staffId;
    return StaffAttendanceEvent.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
    });
  }
}
