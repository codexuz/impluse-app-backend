import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { CallLogService } from "./call-log.service.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Audio Call")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("audio-call")
export class AudioCallController {
  constructor(
    private readonly callLogService: CallLogService,
    private readonly configService: ConfigService,
  ) {}

  @Get("ice-servers")
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.ADMIN,
    Role.SUPPORT_TEACHER,
  )
  @ApiOperation({
    summary: "Get ICE servers (STUN/TURN) for the WebRTC client",
  })
  @ApiResponse({ status: 200, description: "RTCIceServer[] config." })
  getIceServers() {
    // Free public STUN always works for most mobile networks.
    const iceServers: Array<{
      urls: string | string[];
      username?: string;
      credential?: string;
    }> = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ];

    // Optional self-hosted coturn (free to run on your own VPS).
    // Set TURN_URL / TURN_USERNAME / TURN_PASSWORD to enable strict-NAT relay.
    const turnUrl = this.configService.get<string>("TURN_URL");
    const turnUser = this.configService.get<string>("TURN_USERNAME");
    const turnPass = this.configService.get<string>("TURN_PASSWORD");
    if (turnUrl && turnUser && turnPass) {
      iceServers.push({
        urls: turnUrl,
        username: turnUser,
        credential: turnPass,
      });
    }

    return { iceServers };
  }

  @Get("history")
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.ADMIN,
    Role.SUPPORT_TEACHER,
  )
  @ApiOperation({ summary: "Get the current user's call history" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "Paginated call log." })
  getHistory(
    @Request() req,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.callLogService.getHistoryForUser(
      req.user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
