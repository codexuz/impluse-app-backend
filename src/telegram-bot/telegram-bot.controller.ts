import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from "@nestjs/swagger";
import { Request, Response } from "express";
import { TelegramBotService } from "./telegram-bot.service.js";

@ApiTags("Telegram Bot")
@Controller("telegram-bot")
export class TelegramBotController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const bot = this.telegramBotService.getBotInstance();
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  }

  @Post("send-notification")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Send notification to parent via Telegram",
    description: "Send a custom message to all linked parents of a student",
  })
  async sendNotification(
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const { student_id, message } = req.body;

    if (!student_id || !message) {
      return {
        success: false,
        message: "student_id and message are required",
      };
    }

    await this.telegramBotService.sendNotificationToParent(
      student_id,
      message,
    );
    return { success: true, message: "Notification sent" };
  }
}
