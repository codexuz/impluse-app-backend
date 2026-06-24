import { Controller, Post, Req, Res } from "@nestjs/common";
import { SupportBotService } from "./support-bot.service.js";
import { Request, Response } from "express";

@Controller("support-bot")
export class SupportBotController {
  constructor(private readonly botService: SupportBotService) {}

  @Post("webhook")
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      await this.botService.getBotInstance().handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Support Bot Webhook Error:", error);
      res.status(200).send("OK"); // Always return 200 to Telegram
    }
  }
}
