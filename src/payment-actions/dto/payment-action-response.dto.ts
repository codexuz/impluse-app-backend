import { ApiProperty } from "@nestjs/swagger";
import { PaymentActionStage, ActionType } from "./create-payment-action.dto.js";

export class PaymentActionResponseDto {
  @ApiProperty({
    description: "Unique identifier of the payment action",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "The ID of the student payment",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  payment_id: string;

  @ApiProperty({
    description: "The ID of the manager performing the action",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  manager_id: string;

  @ApiProperty({
    description: "Stage of the payment action",
    enum: PaymentActionStage,
    example: PaymentActionStage.UPCOMING,
  })
  stage: string;

  @ApiProperty({
    description: "Type of action taken",
    enum: ActionType,
    example: ActionType.SMS,
  })
  action_type: string;

  @ApiProperty({
    description: "Message sent or note about the action",
    example: "Follow-up SMS sent to student",
  })
  message: string;

  @ApiProperty({
    description: "Date for the next action",
    example: "2024-12-10",
  })
  next_action_date: Date;

  @ApiProperty({
    description: "Created date",
    example: "2024-12-02T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last updated date",
    example: "2024-12-02T10:30:00.000Z",
  })
  updatedAt: Date;
}
