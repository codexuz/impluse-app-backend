import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import {
  GroupEnrollmentEvent,
  EnrollmentEventType,
} from "./entities/group-enrollment-event.entity.js";
import { User } from "../users/entities/user.entity.js";

export interface MonthlyRetention {
  /** First day of the month, ISO date (e.g. "2026-06-01"). */
  month: string;
  year: number;
  /** 1-12 */
  monthNumber: number;
  /** Distinct students active in the teacher's groups at the start of the month. */
  startCount: number;
  /** Of the start-of-month students, how many were still active at month end. */
  retainedCount: number;
  /** Students who left during the month (startCount - retainedCount). */
  leftCount: number;
  /** retainedCount / startCount, 0-1. `null` when there were no students to retain. */
  retentionRate: number | null;
}

export interface TeacherRetentionReport {
  teacherId: string;
  months: MonthlyRetention[];
  /** Simple average of the non-null monthly rates over the window. */
  averageRetentionRate: number | null;
}

/**
 * One join/leave row reduced to what retention needs: which student, when it
 * happened, and whether it added or removed a membership.
 */
interface NormalizedEvent {
  studentId: string;
  occurredAt: Date;
  /** +1 = joined/transferred-in, -1 = left/transferred-out. */
  delta: 1 | -1;
}

@Injectable()
export class RetentionStatsService {
  constructor(
    @InjectModel(GroupEnrollmentEvent)
    private readonly enrollmentEventModel: typeof GroupEnrollmentEvent,
  ) {}

  private static readonly JOIN_TYPES: EnrollmentEventType[] = [
    EnrollmentEventType.JOINED,
    EnrollmentEventType.TRANSFERRED_IN,
  ];

  /** Build the list of [monthStart, monthEnd) windows ending at the anchor month. */
  private buildMonthWindows(
    anchor: Date,
    months: number,
  ): { start: Date; end: Date }[] {
    const windows: { start: Date; end: Date }[] = [];
    const anchorYear = anchor.getUTCFullYear();
    const anchorMonth = anchor.getUTCMonth(); // 0-11

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(Date.UTC(anchorYear, anchorMonth - i, 1));
      const end = new Date(Date.UTC(anchorYear, anchorMonth - i + 1, 1));
      windows.push({ start, end });
    }
    return windows;
  }

  /**
   * Reconstruct, per student, the set of membership counts over time from the
   * event log. A student is "active" at instant T if their net membership count
   * (joins minus leaves up to and including T) is > 0.
   *
   * Returns a map studentId -> sorted events so callers can evaluate membership
   * at any instant without re-querying.
   */
  private indexEventsByStudent(
    events: NormalizedEvent[],
  ): Map<string, NormalizedEvent[]> {
    const byStudent = new Map<string, NormalizedEvent[]>();
    for (const ev of events) {
      const list = byStudent.get(ev.studentId);
      if (list) list.push(ev);
      else byStudent.set(ev.studentId, [ev]);
    }
    for (const list of byStudent.values()) {
      list.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    }
    return byStudent;
  }

  /** Net membership count for a student strictly before instant T. */
  private isActiveBefore(events: NormalizedEvent[], t: Date): boolean {
    let count = 0;
    for (const ev of events) {
      if (ev.occurredAt.getTime() < t.getTime()) count += ev.delta;
      else break;
    }
    return count > 0;
  }

  /**
   * Monthly retention for a single teacher.
   *
   * For each month window [start, end):
   *  - startCount  = students active in the teacher's groups at `start`
   *  - retainedCount = those same students still active at `end`
   *  - retentionRate = retainedCount / startCount
   */
  async getTeacherMonthlyRetention(
    teacherId: string,
    options: { anchor?: Date; months?: number } = {},
  ): Promise<TeacherRetentionReport> {
    const months = options.months ?? 6;
    const anchor = options.anchor ?? new Date();
    const windows = this.buildMonthWindows(anchor, months);

    const windowStart = windows[0].start;
    const windowEnd = windows[windows.length - 1].end;

    // All of this teacher's events up to the end of the window. We need history
    // before `windowStart` too, to know who was already a member at the start.
    const rows = await this.enrollmentEventModel.findAll({
      where: {
        teacher_id: teacherId,
        occurred_at: { [Op.lt]: windowEnd },
      },
      attributes: ["student_id", "event_type", "occurred_at"],
      order: [["occurred_at", "ASC"]],
      raw: true,
    });

    const events: NormalizedEvent[] = rows.map((r: any) => ({
      studentId: r.student_id,
      occurredAt: new Date(r.occurred_at),
      delta: RetentionStatsService.JOIN_TYPES.includes(r.event_type) ? 1 : -1,
    }));

    const byStudent = this.indexEventsByStudent(events);

    const monthly: MonthlyRetention[] = windows.map(({ start, end }) => {
      let startCount = 0;
      let retainedCount = 0;

      for (const studentEvents of byStudent.values()) {
        const activeAtStart = this.isActiveBefore(studentEvents, start);
        if (!activeAtStart) continue;
        startCount++;
        // Retained = still active at month end (membership survived the month).
        if (this.isActiveBefore(studentEvents, end)) retainedCount++;
      }

      const retentionRate =
        startCount > 0 ? retainedCount / startCount : null;

      return {
        month: start.toISOString().slice(0, 10),
        year: start.getUTCFullYear(),
        monthNumber: start.getUTCMonth() + 1,
        startCount,
        retainedCount,
        leftCount: startCount - retainedCount,
        retentionRate,
      };
    });

    const rated = monthly
      .map((m) => m.retentionRate)
      .filter((r): r is number => r !== null);
    const averageRetentionRate =
      rated.length > 0
        ? rated.reduce((a, b) => a + b, 0) / rated.length
        : null;

    return { teacherId, months: monthly, averageRetentionRate };
  }

  /**
   * Monthly retention for every teacher that has enrollment history in the
   * window, ordered by teacher. Useful for an admin dashboard.
   */
  async getAllTeachersMonthlyRetention(options: {
    anchor?: Date;
    months?: number;
  } = {}): Promise<
    (TeacherRetentionReport & {
      teacher: Pick<
        User,
        "user_id" | "first_name" | "last_name" | "username"
      > | null;
    })[]
  > {
    const months = options.months ?? 6;
    const anchor = options.anchor ?? new Date();
    const windowEnd = this.buildMonthWindows(anchor, months).slice(-1)[0].end;

    const teacherRows = await this.enrollmentEventModel.findAll({
      where: {
        teacher_id: { [Op.ne]: null },
        occurred_at: { [Op.lt]: windowEnd },
      },
      attributes: ["teacher_id"],
      group: ["teacher_id"],
      raw: true,
    });

    const teacherIds = teacherRows
      .map((r: any) => r.teacher_id)
      .filter(Boolean);

    const teachers = await User.findAll({
      where: { user_id: teacherIds },
      attributes: ["user_id", "first_name", "last_name", "username"],
      raw: true,
    });
    const teacherById = new Map(teachers.map((t: any) => [t.user_id, t]));

    const reports = await Promise.all(
      teacherIds.map(async (teacherId) => {
        const report = await this.getTeacherMonthlyRetention(teacherId, {
          anchor,
          months,
        });
        return {
          ...report,
          teacher: (teacherById.get(teacherId) as any) ?? null,
        };
      }),
    );

    return reports;
  }
}
