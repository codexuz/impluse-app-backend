import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SmsService } from "./sms.service.js";
import { SendSmsDto } from "./dto/send-sms.dto.js";
import { SendBulkSmsDto } from "./dto/send-bulk-sms.dto.js";
import { CreateTemplateDto } from "./dto/create-template.dto.js";
import { SendVerificationCodeDto } from "./dto/send-verification-code.dto.js";
import { SendNotificationDto } from "./dto/send-notification.dto.js";
import { GetTotalReportByRangeDto } from "./dto/get-total-report-by-range.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("SMS")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("sms")
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post("send")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Send a single SMS" })
  @ApiResponse({ status: 200, description: "SMS sent successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    return this.smsService.sendSms(sendSmsDto);
  }

  @Post("send-bulk")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Send bulk SMS to multiple recipients" })
  @ApiResponse({ status: 200, description: "Bulk SMS sent successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async sendBulkSms(@Body() sendBulkSmsDto: SendBulkSmsDto) {
    return this.smsService.sendBulkSms(sendBulkSmsDto);
  }

  @Post("send-verification")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Send verification code SMS" })
  @ApiResponse({
    status: 200,
    description: "Verification SMS sent successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto
  ) {
    return this.smsService.sendVerificationCode(
      sendVerificationCodeDto.mobile_phone,
      sendVerificationCodeDto.code
    );
  }

  @Post("send-notification")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Send notification SMS" })
  @ApiResponse({
    status: 200,
    description: "Notification SMS sent successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.smsService.sendNotification(
      sendNotificationDto.mobile_phone,
      sendNotificationDto.title,
      sendNotificationDto.body
    );
  }

  @Get("balance")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get SMS account balance" })
  @ApiResponse({ status: 200, description: "Balance retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getBalance() {
    return this.smsService.getBalance();
  }

  @Get("report/monthly/:year")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get monthly SMS report for a specific year" })
  @ApiResponse({
    status: 200,
    description: "Monthly report retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getReportMonthly(@Param("year") year: number) {
    return this.smsService.getReportMonthly(Number(year));
  }

  @Post("report/total-by-range")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get total SMS report by date range with optional filters",
  })
  @ApiResponse({
    status: 200,
    description: "Total report by range retrieved successfully",
  })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getTotalReportByRange(
    @Body() getTotalReportByRangeDto: GetTotalReportByRangeDto
  ) {
    return this.smsService.getTotalReportByRange(
      getTotalReportByRangeDto.start_date,
      getTotalReportByRangeDto.to_date,
      getTotalReportByRangeDto.status,
      getTotalReportByRangeDto.is_ad
    );
  }

  @Post("templates")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new SMS template" })
  @ApiResponse({ status: 201, description: "Template created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.smsService.createTemplate(createTemplateDto);
  }

  @Get("templates")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all SMS templates" })
  @ApiResponse({ status: 200, description: "Templates retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getTemplates() {
    return this.smsService.getTemplates();
  }

  @Get("status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Check SMS service status" })
  @ApiResponse({ status: 200, description: "Service status retrieved" })
  async getStatus() {
    return {
      isReady: this.smsService.isReady(),
      message: this.smsService.isReady()
        ? "SMS service is ready"
        : "SMS service is not initialized",
    };
  }

  @Post("reinitialize")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Reinitialize SMS service" })
  @ApiResponse({
    status: 200,
    description: "Service reinitialized successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async reinitialize() {
    await this.smsService.reinitialize();
    return { message: "SMS service reinitialized successfully" };
  }
}
