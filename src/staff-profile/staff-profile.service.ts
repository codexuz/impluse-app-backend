import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { StaffProfile } from "./entities/staff-profile.entity.js";
import { StaffShift } from "./entities/staff-shift.entity.js";
import { User } from "../users/entities/user.entity.js";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto.js";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto.js";
import { CreateStaffShiftDto } from "./dto/create-staff-shift.dto.js";

const STAFF_INCLUDE = {
  association: "staff",
  attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
};

const SHIFTS_INCLUDE = {
  association: "shifts",
  where: { is_active: true },
  required: false,
};

@Injectable()
export class StaffProfileService {
  // ---------------------------------------------------------------------------
  // Profile CRUD
  // ---------------------------------------------------------------------------

  async create(dto: CreateStaffProfileDto) {
    const user = await User.findByPk(dto.staff_id);
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    const existing = await StaffProfile.findOne({ where: { staff_id: dto.staff_id } });
    if (existing) throw new ConflictException("Ushbu xodim uchun profil allaqachon mavjud");

    return StaffProfile.create({ staff_id: dto.staff_id } as any);
  }

  async findAll() {
    return StaffProfile.findAll({
      order: [["createdAt", "DESC"]],
      include: [STAFF_INCLUDE, SHIFTS_INCLUDE],
    });
  }

  async findOne(id: string) {
    const profile = await StaffProfile.findByPk(id, {
      include: [STAFF_INCLUDE, SHIFTS_INCLUDE],
    });
    if (!profile) throw new NotFoundException("Xodim profili topilmadi");
    return profile;
  }

  async findByStaffId(staffId: string) {
    const profile = await StaffProfile.findOne({
      where: { staff_id: staffId },
      include: [STAFF_INCLUDE, SHIFTS_INCLUDE],
    });
    if (!profile) throw new NotFoundException("Xodim profili topilmadi");
    return profile;
  }

  async update(id: string, _dto: UpdateStaffProfileDto) {
    // Profile itself has no mutable fields beyond shifts now;
    // kept for backward-compat — returns the fresh profile.
    return this.findOne(id);
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    await StaffShift.destroy({ where: { profile_id: id } });
    await profile.destroy();
    return { message: "Xodim profili o'chirildi" };
  }

  // ---------------------------------------------------------------------------
  // Shift CRUD
  // ---------------------------------------------------------------------------

  async addShift(profileId: string, dto: CreateStaffShiftDto) {
    const profile = await StaffProfile.findByPk(profileId);
    if (!profile) throw new NotFoundException("Xodim profili topilmadi");

    return StaffShift.create({
      profile_id: profileId,
      name: dto.name ?? null,
      day_of_week: dto.day_of_week ?? "every_day",
      in_time: dto.in_time,
      out_time: dto.out_time ?? null,
      grace_period_minutes: dto.grace_period_minutes ?? 0,
      is_active: dto.is_active ?? true,
    } as any);
  }

  async updateShift(shiftId: string, dto: Partial<CreateStaffShiftDto>) {
    const shift = await StaffShift.findByPk(shiftId);
    if (!shift) throw new NotFoundException("Shift topilmadi");
    return shift.update({
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.day_of_week !== undefined ? { day_of_week: dto.day_of_week } : {}),
      ...(dto.in_time !== undefined ? { in_time: dto.in_time } : {}),
      ...(dto.out_time !== undefined ? { out_time: dto.out_time } : {}),
      ...(dto.grace_period_minutes !== undefined ? { grace_period_minutes: dto.grace_period_minutes } : {}),
      ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
    });
  }

  async removeShift(shiftId: string) {
    const shift = await StaffShift.findByPk(shiftId);
    if (!shift) throw new NotFoundException("Shift topilmadi");
    await shift.destroy();
    return { message: "Shift o'chirildi" };
  }

  async getShifts(profileId: string) {
    const profile = await StaffProfile.findByPk(profileId);
    if (!profile) throw new NotFoundException("Xodim profili topilmadi");
    return StaffShift.findAll({ where: { profile_id: profileId } });
  }

  // ---------------------------------------------------------------------------
  // Lookup used by attendance service
  // ---------------------------------------------------------------------------

  /**
   * Returns ALL active shifts that apply to a staff member on a given
   * JS day-of-week number (0 = Sunday … 6 = Saturday).
   * Specific-day shifts take priority over odd/even which take priority over
   * every_day — but all matching tiers are returned so the caller can pick
   * the closest one by clock time (supports morning + evening shifts).
   */
  async resolveShiftsForDay(
    staffId: string,
    jsDay: number,
  ): Promise<StaffShift[]> {
    const profile = await StaffProfile.findOne({ where: { staff_id: staffId } });
    if (!profile) return [];

    const shifts = await StaffShift.findAll({
      where: { profile_id: profile.id, is_active: true },
    });
    if (shifts.length === 0) return [];

    const specificDay = [
      "sunday", "monday", "tuesday", "wednesday",
      "thursday", "friday", "saturday",
    ][jsDay];

    const isOdd = [1, 3, 5].includes(jsDay);
    const isEven = [2, 4, 6].includes(jsDay);

    const score = (s: StaffShift): number => {
      if (s.day_of_week === specificDay) return 3;
      if (s.day_of_week === "odd" && isOdd) return 2;
      if (s.day_of_week === "even" && isEven) return 2;
      if (s.day_of_week === "every_day") return 1;
      return -1;
    };

    const matching = shifts.filter((s) => score(s) > 0);
    if (matching.length === 0) return [];

    // Keep only the highest-priority tier so a specific-day shift doesn't
    // compete with an every_day shift on the same day.
    const maxScore = Math.max(...matching.map(score));
    return matching.filter((s) => score(s) === maxScore);
  }

  /**
   * Returns the shift times that apply to a staff member today, based on the
   * server's current day-of-week. Used by the "my today's shift" endpoint.
   */
  async getTodayShifts(staffId: string) {
    const now = new Date();
    const shifts = await this.resolveShiftsForDay(staffId, now.getDay());

    return {
      date: now.toISOString().slice(0, 10),
      day_of_week: [
        "sunday", "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday",
      ][now.getDay()],
      shifts: shifts.map((s) => ({
        id: s.id,
        name: s.name,
        in_time: s.in_time,
        out_time: s.out_time,
        grace_period_minutes: s.grace_period_minutes,
      })),
    };
  }

  /** Convenience: pick the single shift whose in_time is closest to nowMinutes. */
  pickClosestShift(shifts: StaffShift[], nowMinutes: number): StaffShift | null {
    if (shifts.length === 0) return null;
    return shifts.reduce((best, s) => {
      const [h, m] = s.in_time.split(":").map(Number);
      const [bh, bm] = best.in_time.split(":").map(Number);
      const diffS = Math.abs(nowMinutes - (h * 60 + m));
      const diffB = Math.abs(nowMinutes - (bh * 60 + bm));
      return diffS < diffB ? s : best;
    });
  }
}
