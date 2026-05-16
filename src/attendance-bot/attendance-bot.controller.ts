import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AttendanceBotService } from './attendance-bot.service.js';
import { Request, Response } from 'express';

@Controller('attendance-bot')
export class AttendanceBotController {
  constructor(private readonly botService: AttendanceBotService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      await this.botService.getBotInstance().handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(200).send('OK'); // Always return 200 to Telegram
    }
  }
}
