import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendTelegramMessageDto {
  @ApiProperty({ description: "Student parent UUID" })
  @IsUUID()
  @IsNotEmpty()
  parent_id!: string;

  @ApiProperty({ description: "Message text to send" })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ description: "Name of the CRM staff sending the message", required: false })
  @IsString()
  sender_name?: string;
}
