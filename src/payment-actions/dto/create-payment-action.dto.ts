import {
  IsUUID,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum PaymentActionStage {
  UPCOMING = "upcoming",
  DEBITOR = "debitor",
}

export enum ActionType {
  SMS = "sms",
  PHONE = "phone",
  IN_PERSON = "in_person",
}

export class CreatePaymentActionDto {
  @ApiProperty({
    description: "The ID of the student payment",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty({
    description: "The ID of the manager performing the action",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsUUID()
  @IsNotEmpty()
  manager_id: string;

  @ApiProperty({
    description: "Stage of the payment action",
    enum: PaymentActionStage,
    example: PaymentActionStage.UPCOMING,
  })
  @IsEnum(PaymentActionStage)
  @IsNotEmpty()
  stage: string;

  @ApiProperty({
    description: "Type of action taken",
    enum: ActionType,
    example: ActionType.SMS,
  })
  @IsEnum(ActionType)
  @IsNotEmpty()
  action_type: string;

  @ApiProperty({
    description: "Message sent or note about the action",
    example: "Follow-up SMS sent to student",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: "Date for the next action",
    example: "2024-12-10",
  })
  @IsDateString()
  @IsNotEmpty()
  next_action_date: string;
}
