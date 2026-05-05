import {
  Controller,
  Post,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiExcludeEndpoint,
  ApiBody,
  ApiResponse,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { TelegramBotService } from "./telegram-bot.service.js";
import {
  SendNotificationDto,
  SendNotificationResponseDto,
  BroadcastMessageDto,
  BroadcastResponseDto,
} from "./dto/send-notification.dto.js";

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
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({
    status: 200,
    description: "Notification sent successfully",
    type: SendNotificationResponseDto,
  })
  async sendNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<SendNotificationResponseDto> {
    const { student_id, message } = sendNotificationDto;

    await this.telegramBotService.sendNotificationToParent(
      student_id,
      message,
    );
    return { success: true, message: "Notification sent" };
  }

  @Post("broadcast")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Broadcast message to all Telegram-linked parents",
    description: "Send a custom message to every parent who has linked their Telegram account",
  })
  @ApiBody({ type: BroadcastMessageDto })
  @ApiResponse({
    status: 200,
    description: "Broadcast sent successfully",
    type: BroadcastResponseDto,
  })
  async broadcast(
    @Body() broadcastMessageDto: BroadcastMessageDto,
  ): Promise<BroadcastResponseDto> {
    const { message } = broadcastMessageDto;

    const result = await this.telegramBotService.broadcastMessage(message);

    return {
      success: true,
      message: "Broadcast sent",
      ...result,
    };
  }
}
