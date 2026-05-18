import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import {
  CallLog,
  CallKind,
  CallStatus,
} from "./entities/call-log.entity.js";

@Injectable()
export class CallLogService {
  private readonly logger = new Logger(CallLogService.name);

  constructor(
    @InjectModel(CallLog)
    private readonly callLogModel: typeof CallLog,
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
}
