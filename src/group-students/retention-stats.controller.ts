import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RetentionStatsService } from "./retention-stats.service.js";
import { RetentionQueryDto } from "./dto/retention-query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/constants/roles.js";

@ApiTags("Retention Stats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("retention-stats")
export class RetentionStatsController {
  constructor(private readonly retentionStatsService: RetentionStatsService) {}

  /**
   * Resolve the trailing-window anchor (last month included) and length from the
   * query, defaulting to the current month and a 6-month window.
   */
  private resolveOptions(query: RetentionQueryDto): {
    anchor: Date;
    months: number;
  } {
    const now = new Date();
    const year = query.year ?? now.getUTCFullYear();
    // month query is 1-12; Date month is 0-11.
    const monthIndex =
      query.month !== undefined ? query.month - 1 : now.getUTCMonth();
    const anchor = new Date(Date.UTC(year, monthIndex, 1));
    return { anchor, months: query.months ?? 6 };
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({
    summary: "Monthly student retention rate for a specific teacher",
    description:
      "Returns, per month, how many students were active in the teacher's groups at the start of the month and how many remained at the end (retention = retained / start).",
  })
  @ApiResponse({ status: 200, description: "Monthly retention report." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async getTeacherRetention(
    @Param("teacherId") teacherId: string,
    @Query() query: RetentionQueryDto,
  ) {
    const options = this.resolveOptions(query);
    return await this.retentionStatsService.getTeacherMonthlyRetention(
      teacherId,
      options,
    );
  }

  @Get("teachers")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({
    summary: "Monthly student retention rate for all teachers",
    description:
      "Admin dashboard view: monthly retention per teacher across the trailing window.",
  })
  @ApiResponse({ status: 200, description: "Per-teacher retention reports." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async getAllTeachersRetention(@Query() query: RetentionQueryDto) {
    const options = this.resolveOptions(query);
    return await this.retentionStatsService.getAllTeachersMonthlyRetention(
      options,
    );
  }
}
