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
import { BonusPenaltyTransaction } from "../bonus-penalty/entities/bonus-penalty-transaction.entity.js";
import { BonusPenaltyWallet } from "../bonus-penalty/entities/bonus-penalty-wallet.entity.js";
import { BonusPenaltyCategory } from "../bonus-penalty/entities/bonus-penalty-category.entity.js";
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

  /** Today's applicable shifts, sorted by start time (morning → evening). */
  private async getShiftsSorted(teacherId: string, jsDay: number): Promise<StaffShift[]> {
    const shifts = await this.staffProfileService.resolveShiftsForDay(teacherId, jsDay);
    return [...shifts].sort((a, b) => this.toMinutes(a.in_time) - this.toMinutes(b.in_time));
  }

  /**
   * Determines what the next scan should be, driven by how many shifts the
   * staff member has today and how many in/out records already exist.
   *
   * Each shift is one IN→OUT pair, taken in start-time order:
   *   1 shift  → IN, OUT                         (2 records)
   *   2 shifts → IN, OUT, IN, OUT                (4 records)
   *
   * Records strictly alternate, so the count alone tells us the position:
   *   nextType   = even count → "in",  odd count → "out"
   *   shiftIndex = floor(count / 2)  (the shift this scan belongs to)
   *   allDone    = next would be an IN but every shift is already complete
   */
  async getNextScanPlan(teacherId: string): Promise<{
    nextType: "in" | "out";
    shift: StaffShift | null;
    shiftIndex: number;
    totalShifts: number;
    allDone: boolean;
  }> {
    const now = this.getUzTime();
    const today = this.getToday(now);
    const shiftsSorted = await this.getShiftsSorted(teacherId, now.getUTCDay());
    const totalShifts = shiftsSorted.length;

    const count = await StaffAttendance.count({
      where: { teacher_id: teacherId, date: today },
    });

    const nextType: "in" | "out" = count % 2 === 0 ? "in" : "out";
    const pairIndex = Math.floor(count / 2);
    const allDone = totalShifts > 0 && nextType === "in" && pairIndex >= totalShifts;
    const shiftIndex = totalShifts > 0 ? Math.min(pairIndex, totalShifts - 1) : -1;
    const shift = shiftIndex >= 0 ? shiftsSorted[shiftIndex] : null;

    return { nextType, shift, shiftIndex, totalShifts, allDone };
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

    // Shift-count-aware plan: maps this scan to the correct shift (morning →
    // evening) by its position in today's IN/OUT sequence.
    const plan = await this.getNextScanPlan(teacherId);
    const attendanceType = type ?? plan.nextType;

    // Staff with configured shifts: one IN→OUT pair per shift, in order.
    if (plan.totalShifts > 0) {
      if (attendanceType === "in" && plan.allDone) {
        throw new ConflictException(
          `Bugungi barcha smenalar (${plan.totalShifts} ta) uchun davomat allaqachon olingan.`,
        );
      }
      const shift = plan.shift!;
      return this.recordAttendance(teacherId, {
        group: null,
        lessonStart: shift.in_time,
        outTime: shift.out_time ?? null,
        gracePeriod: shift.grace_period_minutes,
        type: attendanceType,
        method: "auto_scan",
        maxPerType: plan.totalShifts,
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
      type?: "in" | "out";
      description?: string;
      isAdmin?: boolean;
      method?: StaffAttendanceEvent["method"];
      rawPayload?: object;
      maxPerType?: number;
    },
  ) {
    const { group, lessonStart, outTime, description, isAdmin } = options;
    const method = options.method ?? "manual";
    const now = this.getUzTime();
    const today = this.getToday(now);
    const requestedType = options.type ?? "in";

    // Sequence validation — one IN and one OUT per shift (defaults to 2 when no
    // shift schedule is known, preserving the legacy two-session allowance).
    const maxPerType = options.maxPerType ?? 2;
    const typeCount = await StaffAttendance.count({
      where: { teacher_id: teacherId, date: today, type: requestedType },
    });

    if (typeCount >= maxPerType) {
      const note = `Bugun uchun davomat (${requestedType === "in" ? "kirish" : "chiqish"}) allaqachon ${maxPerType} marta olingan`;
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

      const jarimaCategory = await BonusPenaltyCategory.findOne({
        where: { type: "jarima" },
        order: [["created_at", "ASC"]],
      });

      await BonusPenaltyTransaction.create({
        teacher_id: teacherId,
        amount: fineAmount,
        type: "jarima",
        category_id: jarimaCategory?.id ?? null,
        description: jarimaDescription,
      } as any);

      const [wallet] = await BonusPenaltyWallet.findOrCreate({
        where: { teacher_id: teacherId },
        defaults: { teacher_id: teacherId, amount: 0 } as any,
      });
      await wallet.update({ amount: wallet.amount - fineAmount });
    }

    return attendance;
  }

  // ---------------------------------------------------------------------------
  // Cron: auto-mark absent
  // ---------------------------------------------------------------------------

  @Cron("0 30 9 * * 1-6") // 09:30 Tashkent = 04:30 UTC, Mon–Sat
  async autoMarkAbsent() {
    const now = this.getUzTime();
    const today = this.getToday(now);
    const todayJsDay = now.getUTCDay();
    const cronCutoff = 9 * 60 + 30; // 09:30 in minutes

    const profiles = await StaffProfile.findAll({
      include: [
        {
          association: "staff",
          required: true,
          include: [{ association: "roles" }],
        },
      ],
    });

    for (const profile of profiles) {
      const staffId = profile.staff_id;
      const roleNames = ((profile.staff as any)?.roles || []).map((r: any) => r.name as string);
      const isTeacher = roleNames.includes("teacher");

      const hasCheckedIn = await StaffAttendance.findOne({
        where: { teacher_id: staffId, date: today, type: "in" },
      });
      if (hasCheckedIn) continue;

      // Approved permission (ruxsat) covering today
      const permission = await this.findActivePermission(staffId, today);
      if (permission) {
        if (permission.type === "late_arrival") {
          // Allowed to arrive late — don't auto-absent; they may still check in
          continue;
        }
        if (permission.type === "full_day") {
          const excusedRecord = await StaffAttendance.create({
            teacher_id: staffId,
            group_id: null,
            date: today,
            status: "excused",
            type: "in",
            fine_amount: 0,
            minutes_late: 0,
            permission_id: permission.id,
            description: "Ruxsat bilan kelmadi (avtomatik belgilandi)",
          } as any);
          await this.logEvent({
            staffId,
            attendanceId: excusedRecord.id,
            method: "cron_absent",
            type: "absent",
            outcome: "success",
            note: "Excused by approved permission",
          });
          continue;
        }
      }

      // Resolve today's shifts — skip staff who have no morning shift by cron time
      const shifts = await this.staffProfileService.resolveShiftsForDay(staffId, todayJsDay);
      // Only auto-absent for shifts whose in_time is <= cron cutoff
      const dueShifts = shifts.filter((s) => {
        const [h, m] = s.in_time.split(":").map(Number);
        return (h * 60 + m) <= (cronCutoff + (s.grace_period_minutes ?? 0));
      });
      if (dueShifts.length === 0) continue;
      // Use the earliest due shift as the reference
      const shift = dueShifts.sort((a, b) => {
        const [ah, am] = a.in_time.split(":").map(Number);
        const [bh, bm] = b.in_time.split(":").map(Number);
        return (ah * 60 + am) - (bh * 60 + bm);
      })[0];

      // Only teachers carry a wallet/transactions, so only they are fined.
      const absenceFine = isTeacher ? 200000 : 0;

      const absentRecord = await StaffAttendance.create({
        teacher_id: staffId,
        group_id: null,
        date: today,
        status: "late",
        type: "in",
        fine_amount: 200000,
        minutes_late: 0,
        description: "Ishga kelmadi (avtomatik belgilandi)",
      } as any);

      if (absenceFine > 0) {
        const jarimaCategory = await BonusPenaltyCategory.findOne({
          where: { type: "jarima" },
          order: [["created_at", "ASC"]],
        });

        await BonusPenaltyTransaction.create({
          teacher_id: staffId,
          amount: absenceFine,
          type: "jarima",
          category_id: jarimaCategory?.id ?? null,
          description: "Ruxsatsiz ishga kelmagani uchun jarima",
        } as any);

        const [wallet] = await BonusPenaltyWallet.findOrCreate({
          where: { teacher_id: staffId },
          defaults: { teacher_id: staffId, amount: 0 } as any,
        });
        await wallet.update({ amount: wallet.amount - absenceFine });
      }

      await this.logEvent({
        staffId,
        attendanceId: absentRecord.id,
        method: "cron_absent",
        type: "absent",
        outcome: "success",
        note: "Auto-marked absent by cron job",
      });
    }
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
