import {
  IsUUID,
  IsEnum,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentActionStage, ActionType } from "./create-payment-action.dto.js";

export class UpdatePaymentActionDto {
  @ApiProperty({
    description: "Stage of the payment action",
    enum: PaymentActionStage,
    example: PaymentActionStage.UPCOMING,
    required: false,
  })
  @IsEnum(PaymentActionStage)
  @IsOptional()
  stage?: string;

  @ApiProperty({
    description: "Type of action taken",
    enum: ActionType,
    example: ActionType.SMS,
    required: false,
  })
  @IsEnum(ActionType)
  @IsOptional()
  action_type?: string;

  @ApiProperty({
    description: "Message sent or note about the action",
    example: "Follow-up SMS sent to student",
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: "Date for the next action",
    example: "2024-12-10",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  next_action_date?: string;
}
