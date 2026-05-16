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
    this.bot.start((ctx) => ctx.reply('Xodimlarning davomatini tekshirish botiga xush kelibsiz. Iltimos, o\'qituvchining QR kodini skanerlang.'));
    
    this.bot.on('message', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const ADMIN_TELEGRAM_ID = '7087270085';
      
      // Security check: Only the hardcoded admin can use this bot
      if (chatId !== ADMIN_TELEGRAM_ID) {
        this.logger.warn(`Unauthorized access attempt by Telegram ID: ${chatId}`);
        return ctx.reply('Kechirasiz, siz ushbu botdan foydalanish huquqiga ega emassiz. Iltimos, administrator bilan bog\'laning.');
      }

      const text = (ctx.message as any).text;
      if (!text) return;

      let teacherId = text.trim();
      
      // Attempt to parse as JSON in case the QR code contains a JSON payload
      try {
        const json = JSON.parse(teacherId);
        if (json.teacher_id) {
          teacherId = json.teacher_id;
        }
      } catch (e) {
        // Not JSON, assume it's the raw ID
      }
      
      // UUID regex check
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(teacherId)) {
        return ctx.reply('O\'qituvchi IDsi noto\'g\'ri. Iltimos, haqiqiy QR kodni skanerlang.');
      }

      try {
        const teacher = await this.userModel.findByPk(teacherId);
        if (!teacher) {
          return ctx.reply('O\'qituvchi topilmadi.');
        }

        const attendance = await this.staffAttendanceService.automaticScan(teacherId);
        const statusMap = {
          'early': 'VAQLI',
          'on_time': "O'Z VAQTIDA",
          'late': 'KECHIKDI'
        };
        const typeMap = {
          'in': 'KIRISH',
          'out': 'CHIQISH'
        };

        const status = statusMap[attendance.status] || attendance.status.toUpperCase();
        const type = typeMap[attendance.type] || attendance.type.toUpperCase();
        
        let response = `✅ Davomat qayd etildi!\n\n`;
        response += `👤 O'qituvchi: ${teacher.first_name} ${teacher.last_name}\n`;
        response += `📝 Turi: ${type}\n`;
        response += `📊 Holati: ${status}\n`;
        
        if (attendance.minutes_late > 0) {
          response += `⏰ Kechikish: ${attendance.minutes_late} daqiqa\n`;
          response += `💰 Jarima: ${attendance.fine_amount.toLocaleString()} so'm\n`;
        }
        
        if (attendance.description) {
          response += `ℹ️ ${attendance.description}`;
        }

        ctx.reply(response);
      } catch (error) {
        this.logger.error(`Error recording attendance: ${error.message}`);
        ctx.reply(`❌ Xatolik: ${error.message}`);
      }
    });
  }
}
