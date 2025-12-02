import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { PaymentActionsService } from "./payment-actions.service.js";
import { CreatePaymentActionDto } from "./dto/create-payment-action.dto.js";
import { UpdatePaymentActionDto } from "./dto/update-payment-action.dto.js";
import { PaymentActionResponseDto } from "./dto/payment-action-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@ApiTags("Payment Actions")
@Controller("payment-actions")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentActionsController {
  constructor(private readonly paymentActionsService: PaymentActionsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new payment action" })
  @ApiResponse({
    status: 201,
    description: "Payment action successfully created",
    type: PaymentActionResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payment or Manager not found" })
  create(
    @Body() createPaymentActionDto: CreatePaymentActionDto,
    @CurrentUser() user: any
  ): Promise<PaymentActionResponseDto> {
    return this.paymentActionsService.create(createPaymentActionDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all payment actions with optional filters" })
  @ApiQuery({
    name: "payment_id",
    required: false,
    description: "Filter by payment ID",
    type: String,
  })
  @ApiQuery({
    name: "manager_id",
    required: false,
    description: "Filter by manager ID",
    type: String,
  })
  @ApiQuery({
    name: "stage",
    required: false,
    description: "Filter by stage (upcoming or debitor)",
    enum: ["upcoming", "debitor"],
  })
  @ApiQuery({
    name: "action_type",
    required: false,
    description: "Filter by action type (sms, phone, or in_person)",
    enum: ["sms", "phone", "in_person"],
  })
  @ApiResponse({
    status: 200,
    description: "List of payment actions",
    type: [PaymentActionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findAll(
    @Query("payment_id") payment_id?: string,
    @Query("manager_id") manager_id?: string,
    @Query("stage") stage?: string,
    @Query("action_type") action_type?: string
  ): Promise<PaymentActionResponseDto[]> {
    return this.paymentActionsService.findAll({
      payment_id,
      manager_id,
      stage,
      action_type,
    });
  }

  @Get("upcoming")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get all upcoming payment actions (due today or earlier)",
  })
  @ApiResponse({
    status: 200,
    description: "List of upcoming payment actions",
    type: [PaymentActionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  getUpcomingActions(): Promise<PaymentActionResponseDto[]> {
    return this.paymentActionsService.getUpcomingActions();
  }

  @Get("by-payment/:payment_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get payment actions by payment ID" })
  @ApiResponse({
    status: 200,
    description: "List of payment actions for the payment",
    type: [PaymentActionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findByPaymentId(
    @Param("payment_id", new ParseUUIDPipe())
    payment_id: string
  ): Promise<PaymentActionResponseDto[]> {
    return this.paymentActionsService.findByPaymentId(payment_id);
  }

  @Get("by-manager/:manager_id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get payment actions by manager ID" })
  @ApiResponse({
    status: 200,
    description: "List of payment actions for the manager",
    type: [PaymentActionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findByManagerId(
    @Param("manager_id", new ParseUUIDPipe())
    manager_id: string
  ): Promise<PaymentActionResponseDto[]> {
    return this.paymentActionsService.findByManagerId(manager_id);
  }

  @Get("by-stage/:stage")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get payment actions by stage" })
  @ApiResponse({
    status: 200,
    description: "List of payment actions for the stage",
    type: [PaymentActionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findByStage(
    @Param("stage") stage: string
  ): Promise<PaymentActionResponseDto[]> {
    if (!["upcoming", "debitor"].includes(stage)) {
      throw new BadRequestException(
        'Stage must be either "upcoming" or "debitor"'
      );
    }
    return this.paymentActionsService.findByStage(stage);
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get a payment action by ID" })
  @ApiResponse({
    status: 200,
    description: "Payment action details",
    type: PaymentActionResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payment action not found" })
  findOne(
    @Param("id", new ParseUUIDPipe())
    id: string
  ): Promise<PaymentActionResponseDto> {
    return this.paymentActionsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a payment action" })
  @ApiResponse({
    status: 200,
    description: "Payment action successfully updated",
    type: PaymentActionResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request - Invalid input data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payment action not found" })
  update(
    @Param("id", new ParseUUIDPipe())
    id: string,
    @Body() updatePaymentActionDto: UpdatePaymentActionDto,
    @CurrentUser() user: any
  ): Promise<PaymentActionResponseDto> {
    return this.paymentActionsService.update(id, updatePaymentActionDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a payment action" })
  @ApiResponse({
    status: 204,
    description: "Payment action successfully deleted",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payment action not found" })
  remove(
    @Param("id", new ParseUUIDPipe())
    id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.paymentActionsService.remove(id);
  }

  @Post(":id/send-sms")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Send SMS for an existing payment action" })
  @ApiResponse({
    status: 200,
    description: "SMS sent successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Action is not SMS type or student phone not found",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "Payment action not found" })
  async sendSmsForAction(
    @Param("id", new ParseUUIDPipe())
    id: string,
    @CurrentUser() user: any
  ): Promise<any> {
    return this.paymentActionsService.sendSmsForExistingAction(id);
  }
}