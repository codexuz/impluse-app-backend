import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Telegraf, Context } from 'telegraf';
import { User } from '../users/entities/user.entity.js';
import { StaffAttendanceService } from '../staff-attendance/staff-attendance.service.js';
import { StaffAttendance } from '../staff-attendance/entities/staff-attendance.entity.js';

@Injectable()
export class AttendanceBotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(AttendanceBotService.name);

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly staffAttendanceService: StaffAttendanceService,
  ) {
    const token = '8209563444:AAHCNgsInpRGy6tZyJa1Lgk_AQqeA4j6g2w';
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.registerCommands();
    
    // Set webhook if TELEGRAM_WEBHOOK_URL is provided, otherwise use polling for local dev
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookPath = `/api/attendance-bot/webhook`;
      await this.bot.telegram.setWebhook(`${webhookUrl}${webhookPath}`);
      this.logger.log(`Attendance Bot webhook set to: ${webhookUrl}${webhookPath}`);
    } else {
      this.bot.launch();
      this.logger.log('Attendance Bot started in polling mode');
    }
    
    this.logger.log('Attendance Bot Service initialized');
  }

  getBotInstance(): Telegraf {
    return this.bot;
  }

  private registerCommands() {
    this.bot.start((ctx) => ctx.reply('Welcome to Staff Attendance Bot. Please scan a teacher QR code.'));
    
    this.bot.on('message', async (ctx) => {
      const chatId = String(ctx.chat.id);
      
      // Security check: Only users with telegram_chat_id set in the database can use this bot
      // We also check if the user is an admin or teacher (optional, based on requirement)
      const user = await this.userModel.findOne({
        where: { telegram_chat_id: chatId },
      });

      if (!user) {
        this.logger.warn(`Unauthorized access attempt by Telegram ID: ${chatId}`);
        return ctx.reply('Sorry, you are not authorized to use this bot. Please contact your administrator.');
      }

      const text = (ctx.message as any).text;
      if (!text) return;

      // Assume the text is a teacher's ID (UUID)
      const teacherId = text.trim();
      
      // UUID regex check
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(teacherId)) {
        return ctx.reply('Invalid Teacher ID. Please scan a valid QR code.');
      }

      try {
        const attendance = await this.staffAttendanceService.automaticScan(teacherId);
        const status = attendance.status.toUpperCase();
        const type = attendance.type.toUpperCase();
        
        let response = `✅ Attendance recorded!\n\n`;
        response += `👤 Teacher ID: ${teacherId.slice(0, 8)}...\n`;
        response += `📝 Type: ${type}\n`;
        response += `📊 Status: ${status}\n`;
        
        if (attendance.minutes_late > 0) {
          response += `⏰ Delay: ${attendance.minutes_late} minutes\n`;
          response += `💰 Fine: ${attendance.fine_amount.toLocaleString()} UZS\n`;
        }
        
        if (attendance.description) {
          response += `ℹ️ ${attendance.description}`;
        }

        ctx.reply(response);
      } catch (error) {
        this.logger.error(`Error recording attendance: ${error.message}`);
        ctx.reply(`❌ Error: ${error.message}`);
      }
    });
  }
}
