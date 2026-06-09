import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import dayjs from "dayjs";
import { LessonSchedule } from "../lesson-schedules/entities/lesson-schedule.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { Group, DaysEnum } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { User } from "../users/entities/user.entity.js";
import { BonusPenaltyTransaction } from "../bonus-penalty/entities/bonus-penalty-transaction.entity.js";
import { BonusPenaltyTransactionService } from "../bonus-penalty/bonus-penalty-transaction.service.js";
import { BonusPenaltyType } from "../bonus-penalty/dto/create-bonus-penalty-transaction.dto.js";



const PENALTY_PER_STUDENT = 5000;
const PENALTY_PER_GROUP_NO_SCHEDULE = 30000;

/** Bugungi kunga mos DaysEnum qiymatlarini aniqlaydi (toq yoki juft kun). 
 * toq  = dushanba(1), chorshanba(3), juma(5)
 * juft = seshanba(2), payshanba(4), shanba(6)
 */
function getDayTypes(date: Date): DaysEnum[] {
  const weekday = dayjs(date).day(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const types: DaysEnum[] = [DaysEnum.EVERY_DAY];
  types.push(weekday % 2 !== 0 ? DaysEnum.ODD : DaysEnum.EVEN);
  return types;
}

function penaltyDescription(
  groupName: string,
  groupId: string,
  date: string,
  unmarkedCount: number,
  studentNames: string[],
): string {
  const nameList = studentNames.join(", ");
  return `[auto] Baholanmagan: ${groupName} guruhida ${date} sanasida ${unmarkedCount} ta o'quvchi baholanmagan (${nameList}). Har bir baholanmagan o'quvchi uchun ${PENALTY_PER_STUDENT} so'm jarima.`;
}

function lessonSchedulePenaltyDescription(
  groupName: string,
  groupId: string,
  date: string,
): string {
  return `[auto] Dars jadvali kiritilmagan: ${groupName} guruhida ${date} sanasida dars jadvali kiritilmagan. Jarima: ${PENALTY_PER_GROUP_NO_SCHEDULE} so'm.`;
}

@Injectable()
export class PenaltyCheckerService {
  private readonly logger = new Logger(PenaltyCheckerService.name);

  constructor(
    @InjectModel(LessonSchedule)
    private lessonScheduleModel: typeof LessonSchedule,
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(BonusPenaltyTransaction)
    private penaltyTransactionModel: typeof BonusPenaltyTransaction,
    private bonusPenaltyTransactionService: BonusPenaltyTransactionService,
  ) {}

  /**
   * Toshkent vaqti bilan 23:30 da ishga tushadi (UTC+5), dushanba–shanba.
   * 23:30 UTC+5 = 18:30 UTC → cron "30 18 * * 1-6"
   *
   * 1. Bugungi kun turini aniqlash (toq / juft).
   * 2. Bugungi kunga mos guruhlarni topish.
   * 3. Har bir guruhning faol o'quvchilarini yuklash.
   * 4. Har bir o'quvchining davomati belgilanganligini tekshirish.
   * 5. Davomati belgilanmagan har bir o'quvchi uchun → o'qituvchiga 5 000 jarima.
   * Eslatma: "absent" belgilangan o'quvchilar uchun jarima berilmaydi.
   */
  @Cron("30 18 * * 1-6", { name: "attendance-penalty-check" })
  async checkAttendanceAndPenalize(): Promise<void> {
    // Use Tashkent time (UTC+5) to determine "today"
    const now = new Date();
    const tashkentOffset = 5 * 60; // minutes
    const tashkentTime = new Date(
      now.getTime() + (tashkentOffset + now.getTimezoneOffset()) * 60_000,
    );
    const today = tashkentTime.toISOString().split("T")[0]; // YYYY-MM-DD

    this.logger.log(`=== Jarima tekshiruvi boshlandi: ${today} ===`);

    // 1. Determine which day types have lessons today
    const dayTypes = getDayTypes(tashkentTime);
    this.logger.log(`Bugun (${today}) kun turi: ${dayTypes.join(", ")}`);

    // 2. Fetch groups that should have had lessons today
    let groups: Group[];
    try {
      groups = await this.groupModel.findAll({
        where: {
          days: { [Op.in]: dayTypes },
          isDeleted: false,
          isIELTS: false,
        },
        attributes: ["id", "name", "teacher_id", "days", "branch_id"],
      });
    } catch (err: any) {
      this.logger.error(`Guruhlarni yuklashda xatolik: ${err.message}`);
      return;
    }

    if (groups.length === 0) {
      this.logger.log("Bugungi kun turiga mos guruhlar topilmadi, tekshirish shart emas");
      return;
    }

    this.logger.log(`Bugun dars bo'ladigan ${groups.length} ta guruh topildi`);

    let totalPenalties = 0;
    let totalUnmarked = 0;
    let errors = 0;

    for (const group of groups) {
      try {
        const result = await this.processGroup(group, today);
        totalPenalties += result.penaltiesIssued;
        totalUnmarked += result.unmarkedStudents;
      } catch (err: any) {
        this.logger.error(
          `Guruhni tekshirishda xatolik ${group.id} (${group.name}): ${err.message}`,
        );
        errors++;
      }
    }

    this.logger.log(
      `=== Jarima tekshiruvi tugadi: ${today}. ` +
        `guruhlar=${groups.length} belgilanmagan=${totalUnmarked} ` +
        `jarimalar=${totalPenalties} xatoliklar=${errors} ===`,
    );
  }

  private async processGroup(
    group: Group,
    date: string,
  ): Promise<{ penaltiesIssued: number; unmarkedStudents: number }> {
    if (!group.teacher_id) {
      this.logger.warn(
        `Guruh ${group.id} (${group.name}) da o'qituvchi biriktirilmagan, o'tkazib yuborildi`,
      );
      return { penaltiesIssued: 0, unmarkedStudents: 0 };
    }

    const teacherId = group.teacher_id;

    // 3. Get all active students in this group
    const activeStudents = await this.groupStudentModel.findAll({
      where: {
        group_id: group.id,
        status: "active",
      },
      attributes: ["id", "student_id"],
      include: [{ model: User, attributes: ["first_name", "last_name"] }],
    });

    if (activeStudents.length === 0) {
      this.logger.debug(
        `Guruh ${group.id} (${group.name}): faol o'quvchilar yo'q, o'tkazib yuborildi`,
      );
      return { penaltiesIssued: 0, unmarkedStudents: 0 };
    }

    const studentIds = activeStudents.map((s) => s.student_id);

    // 4. Check attendance for all students in this group today
    const attendanceRecords = await this.attendanceModel.findAll({
      where: {
        group_id: group.id,
        student_id: { [Op.in]: studentIds },
        date,
      },
      attributes: ["student_id", "status"],
    });

    const markedStudentIds = new Set(attendanceRecords.map((a) => a.student_id));

    // 5. Find students NOT marked at all (no record = unmarked)
    const unmarkedStudents = activeStudents.filter(
      (s) => !markedStudentIds.has(s.student_id),
    );
    const unmarkedStudentIds = unmarkedStudents.map((s) => s.student_id);
    const unmarkedStudentNames = unmarkedStudents.map((s) =>
      `${s.student?.first_name ?? ""} ${s.student?.last_name ?? ""}`.trim(),
    );

    if (unmarkedStudentIds.length === 0) {
      this.logger.debug(
        `Guruh ${group.id} (${group.name}): barcha ${studentIds.length} o'quvchining davomati belgilangan ✓`,
      );
      return { penaltiesIssued: 0, unmarkedStudents: 0 };
    }

    this.logger.warn(
      `Guruh ${group.id} (${group.name}): ${unmarkedStudentIds.length}/${studentIds.length} o'quvchining davomati belgilanMAGAN`,
    );

    // 6. Bugun uchun jarima allaqachon berilganligini tekshirish (takrorlanmasligi uchun)
    const description = penaltyDescription(
      group.name,
      group.id,
      date,
      unmarkedStudentIds.length,
      unmarkedStudentNames,
    );

    const existing = await this.penaltyTransactionModel.findOne({
      where: {
        teacher_id: teacherId,
        description: { [Op.like]: `%guruh=${group.id} sana=${date}%` },
        created_at: {
          [Op.gte]: `${date} 00:00:00`,
          [Op.lte]: `${date} 23:59:59`,
        },
      },
      attributes: ["id"],
    });

    if (existing) {
      this.logger.debug(
        `O'qituvchi ${teacherId} / guruh ${group.id} uchun ${date} sanasida jarima allaqachon berilgan, o'tkazib yuborildi`,
      );
      return { penaltiesIssued: 0, unmarkedStudents: unmarkedStudentIds.length };
    }

    // 7. Jarima berish: har bir belgilanmagan o'quvchi uchun 5000 so'm
    const totalPenalty = PENALTY_PER_STUDENT * unmarkedStudentIds.length;

    await this.bonusPenaltyTransactionService.create({
      teacher_id: teacherId,
      amount: totalPenalty,
      type: BonusPenaltyType.JARIMA,
      description,
    });

    this.logger.warn(
      `Jarima berildi: o'qituvchi=${teacherId} guruh=${group.id} (${group.name}) ` +
        `sana=${date} belgilanmagan=${unmarkedStudentIds.length} summa=${totalPenalty}`,
    );

    return {
      penaltiesIssued: 1,
      unmarkedStudents: unmarkedStudentIds.length,
    };
  }

  /**
   * Toshkent vaqti bilan 09:00 da ishga tushadi (UTC+5), dushanba–shanba.
   * 09:00 UTC+5 = 04:00 UTC → cron "0 4 * * 1-6"
   *
   * Har bir guruh uchun bugungi dars jadvali kiritilganligini tekshiradi.
   * Agar o'qituvchi dars jadvalini kiritmagan bo'lsa → 30 000 so'm jarima.
   */
  @Cron("0 4 * * 1-6", { name: "lesson-schedule-penalty-check" })
  async checkLessonScheduleAndPenalize(): Promise<void> {
    const now = new Date();
    const tashkentOffset = 5 * 60;
    const tashkentTime = new Date(
      now.getTime() + (tashkentOffset + now.getTimezoneOffset()) * 60_000,
    );
    const today = tashkentTime.toISOString().split("T")[0];

    this.logger.log(`=== Dars jadvali jarima tekshiruvi boshlandi: ${today} ===`);

    const dayTypes = getDayTypes(tashkentTime);

    let groups: Group[];
    try {
      groups = await this.groupModel.findAll({
        where: {
          days: { [Op.in]: dayTypes },
          isDeleted: false,
          isIELTS: false,
        },
        attributes: ["id", "name", "teacher_id", "days", "branch_id"],
      });
    } catch (err: any) {
      this.logger.error(`Guruhlarni yuklashda xatolik: ${err.message}`);
      return;
    }

    if (groups.length === 0) {
      this.logger.log("Bugungi kun turiga mos guruhlar topilmadi, tekshirish shart emas");
      return;
    }

    this.logger.log(`Dars jadvali tekshiruvi: ${groups.length} ta guruh topildi`);

    let totalPenalties = 0;
    let errors = 0;

    for (const group of groups) {
      try {
        const penalized = await this.processGroupLessonSchedule(group, today);
        if (penalized) totalPenalties++;
      } catch (err: any) {
        this.logger.error(
          `Dars jadvali tekshirishda xatolik ${group.id} (${group.name}): ${err.message}`,
        );
        errors++;
      }
    }

    this.logger.log(
      `=== Dars jadvali jarima tekshiruvi tugadi: ${today}. ` +
        `guruhlar=${groups.length} jarimalar=${totalPenalties} xatoliklar=${errors} ===`,
    );
  }

  private async processGroupLessonSchedule(
    group: Group,
    date: string,
  ): Promise<boolean> {
    if (!group.teacher_id) {
      this.logger.warn(
        `Guruh ${group.id} (${group.name}) da o'qituvchi biriktirilmagan, o'tkazib yuborildi`,
      );
      return false;
    }

    const teacherId = group.teacher_id;

    // Bugungi dars jadvali borligini tekshirish
    const scheduleCount = await this.lessonScheduleModel.count({
      where: {
        group_id: group.id,
        date,
      },
    });

    if (scheduleCount > 0) {
      this.logger.debug(
        `Guruh ${group.id} (${group.name}): dars jadvali kiritilgan ✓`,
      );
      return false;
    }

    this.logger.warn(
      `Guruh ${group.id} (${group.name}): dars jadvali kiritilMAGAN`,
    );

    // Takrorlanmasligi uchun tekshirish
    const description = lessonSchedulePenaltyDescription(
      group.name,
      group.id,
      date,
    );

    const existing = await this.penaltyTransactionModel.findOne({
      where: {
        teacher_id: teacherId,
        description: { [Op.like]: `%Dars jadvali kiritilmagan%${group.id}%${date}%` },
        created_at: {
          [Op.gte]: `${date} 00:00:00`,
          [Op.lte]: `${date} 23:59:59`,
        },
      },
      attributes: ["id"],
    });

    if (existing) {
      this.logger.debug(
        `O'qituvchi ${teacherId} / guruh ${group.id} uchun ${date} sanasida dars jadvali jarimasi allaqachon berilgan, o'tkazib yuborildi`,
      );
      return false;
    }

    // Jarima berish: 30 000 so'm
    await this.bonusPenaltyTransactionService.create({
      teacher_id: teacherId,
      amount: PENALTY_PER_GROUP_NO_SCHEDULE,
      type: BonusPenaltyType.JARIMA,
      description,
    });

    this.logger.warn(
      `Dars jadvali jarimasi berildi: o'qituvchi=${teacherId} guruh=${group.id} (${group.name}) ` +
        `sana=${date} summa=${PENALTY_PER_GROUP_NO_SCHEDULE}`,
    );

    return true;
  }
}
