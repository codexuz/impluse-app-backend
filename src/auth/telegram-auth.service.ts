import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { Telegraf } from "telegraf";
import { User } from "../users/entities/user.entity.js";
import { Role } from "../users/entities/role.model.js";

@Injectable()
export class TelegramAuthService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramAuthService.name);
  private isReady = false;

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    const token = this.configService.get<string>("TELEGRAM_AUTH_BOT_TOKEN");
    if (!token) {
      this.logger.warn(
        "TELEGRAM_AUTH_BOT_TOKEN is not set. Telegram auth bot will not start.",
      );
    }
    this.bot = new Telegraf(token || "dummy");
  }

  async onModuleInit() {
    const token = this.configService.get<string>("TELEGRAM_AUTH_BOT_TOKEN");
    if (!token) return;

    this.registerCommands();

    // Set webhook using the same base URL as the main bot
    const webhookUrl = this.configService.get<string>("TELEGRAM_WEBHOOK_URL");
    if (webhookUrl) {
      const webhookPath = `/api/auth/telegram-auth/webhook`;
      try {
        await this.bot.telegram.setWebhook(`${webhookUrl}${webhookPath}`);
        this.isReady = true;
        this.logger.log(
          `Telegram Auth Bot webhook set to: ${webhookUrl}${webhookPath}`,
        );
      } catch (error) {
        this.logger.error("Failed to set Telegram Auth Bot webhook:", error);
      }
    } else {
      this.logger.warn(
        "TELEGRAM_WEBHOOK_URL is not set. Telegram Auth Bot will not start.",
      );
    }
  }

  async onModuleDestroy() {
    if (this.isReady) {
      try {
        await this.bot.telegram.deleteWebhook();
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /** Expose bot instance for webhook handling */
  getBotInstance(): Telegraf {
    return this.bot;
  }

  private registerCommands() {
    this.bot.telegram.setMyCommands([
      { command: "start", description: "🔐 Link your admin account" },
    ]);

    this.bot.command("start", async (ctx) => {
      const chatId = String(ctx.chat.id);

      // Check if any admin user is already linked to this chat
      const existingUser = await this.userModel.findOne({
        where: { telegram_chat_id: chatId },
        include: [{ model: Role, as: "roles" }],
      });

      if (existingUser) {
        const isAdmin = existingUser.roles?.some(
          (r) => r.name.toLowerCase() === "admin",
        );
        if (isAdmin) {
          await ctx.reply(
            `✅ You are already linked!\n\n` +
              `👤 Account: ${existingUser.first_name} ${existingUser.last_name}\n` +
              `📧 Username: ${existingUser.username}\n\n` +
              `🔐 You will receive OTP codes here when logging into the admin panel.`,
          );
          return;
        }
      }

      await ctx.reply(
        `🔐 *Impulse Admin Authentication Bot*\n\n` +
          `Welcome! This bot sends OTP verification codes for admin login.\n\n` +
          `Your Telegram Chat ID: \`${chatId}\`\n\n` +
          `To link your admin account, please ask an administrator to set your Telegram Chat ID in the system, or use the admin panel to link your account.\n\n` +
          `Once linked, you will receive OTP codes here when logging in.`,
        { parse_mode: "Markdown" },
      );
    });

    // Handle any other messages
    this.bot.on("message", async (ctx) => {
      await ctx.reply(
        "🔐 This bot is for admin authentication only.\n\n" +
          "You will receive OTP codes here when logging into the admin panel.",
      );
    });
  }

  /**
   * Send OTP code to admin via Telegram
   * @returns true if message was sent successfully, false otherwise
   */
  async sendOtpCode(chatId: string, code: string): Promise<boolean> {
    if (!this.isReady) {
      this.logger.warn("Telegram Auth Bot is not ready. Cannot send OTP.");
      return false;
    }

    try {
      await this.bot.telegram.sendMessage(
        chatId,
        `🔐 *Admin Login OTP*\n\n` +
          `Your verification code:\n\n` +
          `\`${code}\`\n\n` +
          `⏰ This code expires in *3 minutes*.\n\n` +
          `⚠️ Do not share this code with anyone!`,
        { parse_mode: "Markdown" },
      );
      this.logger.log(`OTP sent via Telegram to chat ${chatId}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send OTP via Telegram to chat ${chatId}:`,
        error,
      );
      return false;
    }
  }
}
