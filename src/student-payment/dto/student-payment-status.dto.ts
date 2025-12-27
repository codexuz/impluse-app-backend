import { ApiProperty } from "@nestjs/swagger";

export class StudentPaymentStatusDto {
  @ApiProperty({
    description: "Total amount paid by the student",
    example: 1250.0,
  })
  totalPaid: number;

  @ApiProperty({
    description: "Total amount of pending payments",
    example: 250.0,
  })
  pendingAmount: number;

  @ApiProperty({
    description: "Current payment status",
    example: "on_time",
    enum: ["on_time", "overdue", "upcoming"],
  })
  paymentStatus: "on_time" | "overdue" | "upcoming";

  @ApiProperty({
    description: "Days until next payment is due (negative if overdue)",
    example: 5,
  })
  daysUntilNextPayment: number;

  @ApiProperty({
    description: "Next payment date",
    example: "2025-08-15",
  })
  nextPaymentDate: Date;
}
