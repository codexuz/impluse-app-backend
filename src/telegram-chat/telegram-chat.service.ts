import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MessageEvent } from "@nestjs/common";
import { TelegramChatMessage } from "./entities/telegram-chat-message.entity.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { SendTelegramMessageDto } from "./dto/send-telegram-message.dto.js";
import { QueryTelegramChatDto } from "./dto/query-telegram-chat.dto.js";
import type { TelegramBotService } from "../telegram-bot/telegram-bot.service.js";

export interface IncomingMessageEvent {
  parent_id: string;
  student_id: string;
  telegram_chat_id: string;
  message: string;
  createdAt: Date;
}

@Injectable()
export class TelegramChatService {
  private readonly logger = new Logger(TelegramChatService.name);

  /** Emits every time a parent sends an incoming message — consumed by SSE subscribers */
  private readonly messageSubject = new Subject<IncomingMessageEvent>();

  /** Observable stream of incoming messages for SSE */
  get newMessages$(): Observable<IncomingMessageEvent> {
    return this.messageSubject.asObservable();
  }

  constructor(
    @InjectModel(TelegramChatMessage)
    private readonly messageModel: typeof TelegramChatMessage,

    @InjectModel(StudentParent)
    private readonly studentParentModel: typeof StudentParent,

    @Inject('TELEGRAM_BOT_SERVICE')
    private readonly telegramBotService: TelegramBotService,
  ) {}

  /**
   * Save an incoming message from a Telegram parent.
   * Called by TelegramBotService whenever a registered parent sends a text message.
   */
  async saveIncomingMessage(
    telegramChatId: string,
    text: string,
  ): Promise<void> {
    const parents = await this.studentParentModel.findAll({
      where: { telegram_chat_id: telegramChatId },
    });

    if (!parents.length) return;

    const saved = await Promise.all(
      parents.map((parent) =>
        this.messageModel.create({
          parent_id: parent.id,
          student_id: parent.student_id,
          telegram_chat_id: telegramChatId,
          message: text,
          direction: "incoming",
          is_read: false,
        }),
      ),
    );

    // Notify all SSE subscribers for each linked parent record
    for (const record of saved) {
      this.messageSubject.next({
        parent_id: record.parent_id,
        student_id: record.student_id,
        telegram_chat_id: record.telegram_chat_id,
        message: record.message,
        createdAt: record.createdAt,
      });
    }
  }

  /**
   * Send a message from the CRM panel to a parent via Telegram and persist it.
   */
  async sendMessageToParent(dto: SendTelegramMessageDto): Promise<TelegramChatMessage> {
    const parent = await this.studentParentModel.findByPk(dto.parent_id);

    if (!parent) {
      throw new NotFoundException(`Parent with id ${dto.parent_id} not found`);
    }

    if (!parent.telegram_chat_id) {
      throw new BadRequestException(
        "This parent has not connected via Telegram yet",
      );
    }

    const bot = this.telegramBotService.getBotInstance();
    await bot.telegram.sendMessage(parent.telegram_chat_id, dto.message);

    const saved = await this.messageModel.create({
      parent_id: parent.id,
      student_id: parent.student_id,
      telegram_chat_id: parent.telegram_chat_id,
      message: dto.message,
      direction: "outgoing",
      sender_name: dto.sender_name ?? null,
      is_read: true,
    });

    return saved;
  }

  /**
   * Get paginated messages for a specific parent (conversation thread).
   */
  async getMessages(dto: QueryTelegramChatDto): Promise<{
    data: TelegramChatMessage[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 50;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (dto.parent_id) where.parent_id = dto.parent_id;
    if (dto.student_id) where.student_id = dto.student_id;
    if (dto.unread_only) {
      where.is_read = false;
      where.direction = "incoming";
    }

    const { rows, count } = await this.messageModel.findAndCountAll({
      where,
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    return { data: rows, total: count, page, limit };
  }

  /**
   * Get conversations grouped by parent — one entry per unique telegram_chat_id
   * with the latest message and unread count. Used for the CRM inbox view.
   */
  async getConversations(): Promise<
    {
      parent_id: string;
      student_id: string;
      telegram_chat_id: string;
      parent_name: string;
      parent_phone: string;
      last_message: string;
      last_message_at: Date;
      unread_count: number;
    }[]
  > {
    // Fetch all parents who have an active Telegram connection
    const parents = await this.studentParentModel.findAll({
      where: { telegram_chat_id: { [Op.ne]: null } },
    });

    const results = await Promise.all(
      parents.map(async (parent) => {
        const latest = await this.messageModel.findOne({
          where: { parent_id: parent.id },
          order: [["createdAt", "DESC"]],
        });

        const unreadCount = await this.messageModel.count({
          where: {
            parent_id: parent.id,
            direction: "incoming",
            is_read: false,
          },
        });

        return {
          parent_id: parent.id,
          student_id: parent.student_id,
          telegram_chat_id: parent.telegram_chat_id!,
          parent_name: parent.full_name,
          parent_phone: parent.phone_number,
          last_message: latest?.message ?? "",
          last_message_at: latest?.createdAt ?? parent.createdAt,
          unread_count: unreadCount,
        };
      }),
    );

    // Sort by most recent conversation first
    return results
      .filter((r) => r.last_message !== "")
      .sort((a, b) => b.last_message_at.getTime() - a.last_message_at.getTime());
  }

  /**
   * Mark all incoming messages from a parent as read.
   */
  async markConversationAsRead(parent_id: string): Promise<{ updated: number }> {
    const parent = await this.studentParentModel.findByPk(parent_id);
    if (!parent) throw new NotFoundException(`Parent with id ${parent_id} not found`);

    const [updated] = await this.messageModel.update(
      { is_read: true },
      {
        where: {
          parent_id,
          direction: "incoming",
          is_read: false,
        },
      },
    );

    return { updated };
  }

  /**
   * Get total count of unread incoming messages across all parents.
   */
  async getUnreadCount(): Promise<{ unread_count: number }> {
    const unread_count = await this.messageModel.count({
      where: { direction: "incoming", is_read: false },
    });
    return { unread_count };
  }
}
