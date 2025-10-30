import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";

export class TransferStudentDto {
  @ApiProperty({
    description: "The UUID of the student to transfer",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    description:
      "The UUID of the source group (where student is currently enrolled)",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  from_group_id: string;

  @ApiProperty({
    description:
      "The UUID of the target group (where student will be transferred)",
    example: "987fcdeb-51a2-43d1-9b23-456789012345",
  })
  @IsUUID()
  @IsNotEmpty()
  to_group_id: string;
}
