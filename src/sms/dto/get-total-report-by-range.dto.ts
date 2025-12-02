import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsNotEmpty } from "class-validator";

export enum ReportStatus {
  ALL = "",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

export enum IsAdType {
  ALL = "",
  ADVERTISEMENT = "1",
  SERVICE = "0",
}

export class GetTotalReportByRangeDto {
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
  to_date: string;

  @ApiProperty({
    description:
      'Status filter: empty for all, "delivered" for delivered only, "rejected" for rejected only',
    enum: ReportStatus,
    required: false,
    default: ReportStatus.ALL,
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus = ReportStatus.ALL;

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
