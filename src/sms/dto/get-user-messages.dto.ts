import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

export enum MessageStatus {
  ALL = "",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

export enum IsAdType {
  ALL = "",
  ADVERTISEMENT = "1",
  SERVICE = "0",
}

export class GetUserMessagesDto {
  @ApiProperty({
    description: "Start date in YYYY-MM-DD HH:MM format",
    example: "2023-11-01 00:00",
  })
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    description: "End date in YYYY-MM-DD HH:MM format",
    example: "2023-11-02 23:59",
  })
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({
    description:
      'Status filter: empty for all, "delivered" for delivered only, "rejected" for rejected only',
    enum: MessageStatus,
    required: false,
    default: MessageStatus.ALL,
  })
  @IsEnum(MessageStatus)
  @IsOptional()
  status?: MessageStatus = MessageStatus.ALL;

  @ApiProperty({
    description: "Number of SMS messages to return (from 20 to 200)",
    example: 20,
    minimum: 20,
    maximum: 200,
    required: false,
    default: 20,
  })
  @IsNumber()
  @Min(20)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  page_size?: number = 20;

  @ApiProperty({
    description: "1 - If necessary to get totals by status, 0 - otherwise",
    example: 0,
    enum: [0, 1],
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  count?: number = 0;

  @ApiProperty({
    description:
      'Advertisement filter: empty for all, "1" for advertisement only, "0" for service only',
    enum: IsAdType,
    required: false,
    default: IsAdType.ALL,
  })
  @IsEnum(IsAdType)
  @IsOptional()
  is_ad?: IsAdType = IsAdType.ALL;
}
