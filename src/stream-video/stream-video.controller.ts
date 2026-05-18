import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { StreamVideoService } from './stream-video.service.js';
import { CreateUserCallDto, CreateAiCallDto } from './dto/stream-video.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Stream Video Calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stream-video')
export class StreamVideoController {
  constructor(private readonly streamVideoService: StreamVideoService) {}

  @Post('token')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Generate a Stream user token for the current user' })
  @ApiResponse({ status: 201, description: 'Token generated successfully' })
  generateToken(@Request() req) {
    return this.streamVideoService.generateUserToken(req.user.userId);
  }

  @Post('call/user')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Create a user-to-user audio call' })
  @ApiResponse({ status: 201, description: 'Call created. Both users can join using their tokens.' })
  createUserCall(@Body() dto: CreateUserCallDto, @Request() req) {
    return this.streamVideoService.createUserToUserCall(req.user.userId, dto);
  }

  @Post('call/ai')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Create an audio call with the AI agent (OpenAI Realtime)' })
  @ApiResponse({ status: 201, description: 'AI call created and agent started.' })
  createAiCall(@Body() dto: CreateAiCallDto, @Request() req) {
    return this.streamVideoService.createAiAgentCall(req.user.userId, dto);
  }

  @Post('call/:callId/end')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'End a call' })
  @ApiParam({ name: 'callId', description: 'The call ID to end' })
  @ApiResponse({ status: 200, description: 'Call ended' })
  endCall(@Param('callId') callId: string) {
    return this.streamVideoService.endCall(callId);
  }

  @Get('call/:callId')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Get call details' })
  @ApiParam({ name: 'callId', description: 'The call ID' })
  @ApiResponse({ status: 200, description: 'Call info retrieved' })
  getCall(@Param('callId') callId: string) {
    return this.streamVideoService.getCallInfo(callId);
  }
}
