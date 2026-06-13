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
import { AudioCallGateway } from "./audio-call.gateway.js";
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
    private readonly gateway: AudioCallGateway,
  ) {}

  @Get("ice-servers")
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.ADMIN,
    Role.OWNER,
    Role.MANAGER,
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

    // TURN relay for strict / symmetric-NAT networks (without it those
    // peers can't connect at all). TURN_URL may be a single URL or a
    // comma-separated list so one credential can cover several transports
    // (e.g. UDP 3478, TCP 3478, TLS 443 for firewall traversal).
    const turnUrl = this.configService.get<string>("TURN_URL");
    const turnUser = this.configService.get<string>("TURN_USERNAME");
    const turnPass = this.configService.get<string>("TURN_PASSWORD");
    if (turnUrl && turnUser && turnPass) {
      const urls = turnUrl
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);
      if (urls.length > 0) {
        iceServers.push({
          urls: urls.length === 1 ? urls[0] : urls,
          username: turnUser,
          credential: turnPass,
        });
      }
    }

    return { iceServers };
  }

  @Get("online-students")
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.ADMIN,
    Role.OWNER,
    Role.MANAGER,
    Role.SUPPORT_TEACHER,
  )
  @ApiOperation({
    summary:
      "Online students (role=student) in an English group, with the level " +
      "taken from that group. Optional search by username, first/last name, " +
      "or phone.",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Match against username, first_name, last_name, or phone.",
  })
  @ApiResponse({ status: 200, description: "OnlineStudent[]." })
  getOnlineStudents(@Request() req, @Query("search") search?: string) {
    const onlineIds = this.gateway.getOnlineUserIds();
    return this.callLogService.getOnlineStudents(
      req.user.userId,
      onlineIds,
      search,
    );
  }

  @Get("history")
  @Roles(
    Role.STUDENT,
    Role.TEACHER,
    Role.ADMIN,
    Role.OWNER,
    Role.MANAGER,
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
