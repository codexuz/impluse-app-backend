import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Header,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { AiChatBotService } from "./ai-chat-bot.service.js";
import { CreateAiChatBotDto } from "./dto/create-ai-chat-bot.dto.js";
import { EditMessageDto } from "./dto/edit-message.dto.js";
import { DeleteMessageDto } from "./dto/delete-message.dto.js";
import { Response } from "express";

@ApiTags("AI Chat Bot")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ai-chat-bot")
export class AiChatBotController {
  constructor(private readonly aiChatBotService: AiChatBotService) {}

  @Post()
  @Header("Content-Type", "text/plain")
  @Header("Cache-Control", "no-cache")
  @Header("Connection", "keep-alive")
  @Header("Transfer-Encoding", "chunked")
  @ApiOperation({ summary: "Create a new chat message (streaming)" })
  @ApiResponse({
    status: 201,
    description: "Chat message streamed successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  create(
    @Req() req,
    @Body() createAiChatBotDto: CreateAiChatBotDto,
    @Res() res: Response,
  ) {
    const userId = req.user?.id || req.user?.userId || req.user?.user_id;
    if (!userId) {
      throw new Error(
        "User ID not found in request. User object: " +
          JSON.stringify(req.user),
      );
    }

    return this.aiChatBotService.createStream(userId, createAiChatBotDto, res);
  }

  @Get()
  @ApiOperation({ summary: "Get chat history for current user" })
  @ApiResponse({ status: 200, description: "Returns chat history." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  findAll(@Req() req) {
    const userId = req.user?.id || req.user?.userId || req.user?.user_id;
    if (!userId) {
      throw new Error(
        "User ID not found in request. User object: " +
          JSON.stringify(req.user),
      );
    }
    return this.aiChatBotService.findAll(userId);
  }

  @Delete()
  @ApiOperation({ summary: "Clear chat history for current user" })
  @ApiResponse({ status: 200, description: "Chat history cleared." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  clear(@Req() req) {
    const userId = req.user?.id || req.user?.userId || req.user?.user_id;
    if (!userId) {
      throw new Error(
        "User ID not found in request. User object: " +
          JSON.stringify(req.user),
      );
    }
    return this.aiChatBotService.clear(userId);
  }

  @Patch("/edit-message/:messageId")
  @ApiOperation({ summary: "Edit a chat message" })
  @ApiResponse({ status: 200, description: "Message edited successfully." })
  @ApiResponse({ status: 404, description: "Message not found." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  editMessage(
    @Req() req,
    @Param() { messageId }: EditMessageDto,
    @Body() editMessageDto: EditMessageDto,
  ) {
    const userId = req.user?.id || req.user?.userId || req.user?.user_id;
    if (!userId) {
      throw new Error(
        "User ID not found in request. User object: " +
          JSON.stringify(req.user),
      );
    }
    return this.aiChatBotService.editMessage(
      userId,
      messageId,
      editMessageDto.content,
    );
  }

  @Delete("message/:messageId")
  @ApiOperation({ summary: "Delete a specific chat message" })
  @ApiResponse({ status: 200, description: "Message deleted successfully." })
  @ApiResponse({ status: 404, description: "Message not found." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  deleteMessage(
    @Req() req,
    @Param("messageId") deleteMessageDto: DeleteMessageDto,
  ) {
    const userId = req.user?.id || req.user?.userId || req.user?.user_id;
    if (!userId) {
      throw new Error(
        "User ID not found in request. User object: " +
          JSON.stringify(req.user),
      );
    }
    return this.aiChatBotService.deleteMessage(
      userId,
      deleteMessageDto.messageId,
    );
  }
}
