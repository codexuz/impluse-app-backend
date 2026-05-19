import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import {
  CallLog,
  CallKind,
  CallStatus,
} from "./entities/call-log.entity.js";
import { User } from "../users/entities/user.entity.js";

export interface OnlineStudent {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  // Level the student is studying, taken from their English group.
  level: {
    id: string;
    title: string;
    level: string | null; // A1 | A2 | B1 | B2 | C1
  } | null;
}

@Injectable()
export class CallLogService {
  private readonly logger = new Logger(CallLogService.name);

  constructor(
    @InjectModel(CallLog)
    private readonly callLogModel: typeof CallLog,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createCall(params: {
    kind: CallKind;
    callerId: string;
    calleeId: string | null;
  }): Promise<CallLog> {
    return this.callLogModel.create({
      kind: params.kind,
      caller_id: params.callerId,
      callee_id: params.calleeId,
      status: "ringing",
    });
  }

  async markOngoing(callId: string): Promise<void> {
    await this.callLogModel.update(
      { status: "ongoing", started_at: new Date() },
      { where: { id: callId } },
    );
  }

  async markEnded(
    callId: string,
    status: Extract<
      CallStatus,
      "completed" | "missed" | "rejected" | "failed" | "cancelled"
    >,
    reason?: string,
  ): Promise<void> {
    const call = await this.callLogModel.findByPk(callId);
    if (!call) return;

    const endedAt = new Date();
    const durationSeconds = call.started_at
      ? Math.max(
          0,
          Math.round((endedAt.getTime() - call.started_at.getTime()) / 1000),
        )
      : 0;

    await call.update({
      status,
      ended_at: endedAt,
      duration_seconds: durationSeconds,
      end_reason: reason ?? null,
    });
  }

  async getHistoryForUser(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: CallLog[]; total: number; page: number; limit: number }> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (Math.max(page, 1) - 1) * safeLimit;

    const { rows, count } = await this.callLogModel.findAndCountAll({
      where: {
        [Op.or]: [{ caller_id: userId }, { callee_id: userId }],
      },
      order: [["created_at", "DESC"]],
      limit: safeLimit,
      offset,
    });

    return { data: rows, total: count, page, limit: safeLimit };
  }

  async getCall(callId: string): Promise<CallLog | null> {
    return this.callLogModel.findByPk(callId);
  }

  /**
   * Online students (role = "student") that the caller can ring.
   *
   * - restricted to the given `onlineUserIds` (presence is tracked in
   *   the gateway, not the DB)
   * - excludes the requesting user
   * - only students enrolled in an English group (`groups.isEnglish = true`,
   *   active enrollment); the student's level is read from that group's
   *   course (`groups.level_id` -> courses, aliased "level")
   * - optional `search` matches username / first_name / last_name / phone
   */
  async getOnlineStudents(
    currentUserId: string,
    onlineUserIds: string[],
    search?: string,
  ): Promise<OnlineStudent[]> {
    const candidateIds = onlineUserIds.filter((id) => id !== currentUserId);
    if (candidateIds.length === 0) return [];

    const trimmed = search?.trim();
    // MySQL `LIKE` is case-insensitive under the default collation.
    const searchWhere = trimmed
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${trimmed}%` } },
            { first_name: { [Op.like]: `%${trimmed}%` } },
            { last_name: { [Op.like]: `%${trimmed}%` } },
            { phone: { [Op.like]: `%${trimmed}%` } },
          ],
        }
      : {};

    const users = await this.userModel.findAll({
      where: {
        user_id: { [Op.in]: candidateIds },
        is_active: true,
        ...searchWhere,
      },
      attributes: [
        "user_id",
        "username",
        "first_name",
        "last_name",
        "phone",
        "avatar_url",
      ],
      include: [
        {
          association: "roles",
          attributes: [],
          through: { attributes: [] },
          where: { name: "student" },
          required: true,
        },
        {
          association: "groups",
          attributes: ["id", "name", "isEnglish"],
          // active enrollment in an English group
          through: { attributes: [], where: { status: "active" } },
          where: { isEnglish: true },
          required: true,
          include: [
            {
              association: "level",
              attributes: ["id", "title", "level"],
            },
          ],
        },
      ],
      order: [
        ["first_name", "ASC"],
        ["last_name", "ASC"],
      ],
      // a student can be in multiple groups -> dedupe rows
      subQuery: false,
    });

    // Map to a flat shape, picking the first English group's level.
    const seen = new Set<string>();
    const result: OnlineStudent[] = [];
    for (const u of users) {
      const user = u as any;
      if (seen.has(user.user_id)) continue;
      seen.add(user.user_id);

      const englishGroup = (user.groups ?? []).find(
        (g: any) => g.isEnglish && g.level,
      );
      const level = englishGroup?.level ?? null;

      result.push({
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone ?? null,
        avatar_url: user.avatar_url ?? null,
        level: level
          ? {
              id: level.id,
              title: level.title,
              level: level.level ?? null,
            }
          : null,
      });
    }

    return result;
  }
}
