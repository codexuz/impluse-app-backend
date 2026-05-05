import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Sse,
  MessageEvent,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
} from "@nestjs/swagger";
import { TelegramChatService } from "./telegram-chat.service.js";
import { SendTelegramMessageDto } from "./dto/send-telegram-message.dto.js";
import { QueryTelegramChatDto } from "./dto/query-telegram-chat.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@ApiTags("Telegram Chat")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("telegram-chat")
export class TelegramChatController {
  constructor(private readonly telegramChatService: TelegramChatService) {}

  @Sse("events")
  @ApiExcludeEndpoint()
  streamIncomingMessages(): Observable<MessageEvent> {
    return this.telegramChatService.newMessages$.pipe(
      map((payload) => ({ data: payload }) as MessageEvent),
    );
  }

  @Get("conversations")
  @ApiOperation({
    summary: "Get all Telegram conversations (CRM inbox)",
    description:
      "Returns all parents who have an active Telegram connection, with their latest message and unread count.",
  })
  @ApiResponse({ status: 200, description: "List of conversations" })
  async getConversations() {
    return this.telegramChatService.getConversations();
  }

  @Get("unread-count")
  @ApiOperation({ summary: "Get total unread incoming message count" })
  async getUnreadCount() {
    return this.telegramChatService.getUnreadCount();
  }

  @Get("messages")
  @ApiOperation({
    summary: "Get messages for a parent conversation",
    description:
      "Returns paginated messages. Filter by parent_id or student_id. Use unread_only=true to show only unread incoming messages.",
  })
  async getMessages(@Query() query: QueryTelegramChatDto) {
    return this.telegramChatService.getMessages(query);
  }

  @Post("send")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Send a message to a parent via Telegram",
    description:
      "Sends a message from the CRM panel to a parent's Telegram and saves it to the chat history.",
  })
  @ApiResponse({ status: 201, description: "Message sent and saved" })
  @ApiResponse({ status: 400, description: "Parent has no Telegram connected" })
  @ApiResponse({ status: 404, description: "Parent not found" })
  async sendMessage(
    @Body() dto: SendTelegramMessageDto,
    @CurrentUser() user: { first_name: string; last_name: string },
  ) {
    dto.sender_name = `${user.first_name} ${user.last_name}`;
    return this.telegramChatService.sendMessageToParent(dto);
  }

  @Patch(":parent_id/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mark all incoming messages from a parent as read",
  })
  @ApiResponse({ status: 200, description: "Messages marked as read" })
  async markAsRead(
    @Param("parent_id", new ParseUUIDPipe()) parent_id: string,
  ) {
    return this.telegramChatService.markConversationAsRead(parent_id);
  }
}
