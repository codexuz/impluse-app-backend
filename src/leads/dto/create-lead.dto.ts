import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
} from "class-validator";

export enum LeadStatus {
  YANGI = "Yangi",
  ALOQADA = "Aloqada",
  SINOVDA = "Sinovda",
  SINOVDA_QATNASHDI = "Sinovda qatnashdi",
  SINOVDAN_KETDI = "Sinovdan ketdi",
  OQISHGA_YOZILDI = "O'qishga yozildi",
  YOQOTILDI = "Yo'qotildi",
}

export enum LeadSource {
  INSTAGRAM = "Instagram",
  TELEGRAM = "Telegram",
  DOSTIMDAN = "Do'stimdan",
  OZIM_KELDIM = "O'zim keldim",
  FLAYER = "Flayer",
  BANNER_YONDAGI = "Banner(yondagi)",
  BANNER_KOCHADAGI = "Banner(ko'chadagi)",
  BOSHQA = "Boshqa",
}

export class CreateLeadDto {
  @ApiProperty({
    description: "Lead phone number",
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Lead phone number",
    example: "+998901234567",
    required: false,
  })
  @IsString()
  @IsOptional()
  parent_phone_number: string;

  @ApiProperty({
    description: "Additional phone number",
    example: "+998901234568",
    required: false,
  })
  @IsString()
  @IsOptional()
  additional_number: string;

  @ApiProperty({
    description: "Lead question or inquiry",
    example: "Ingliz tili kurslari haqida malumot olmoqchiman",
  })
  @IsString()
  @IsOptional()
  question: string;

  @ApiProperty({
    description: "Lead first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "Lead last name",
    example: "Doe",
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: "Lead status",
    enum: LeadStatus,
    example: LeadStatus.YANGI,
  })
  @IsEnum(LeadStatus)
  status: LeadStatus;

  @ApiProperty({
    description: "Lead source",
    enum: LeadSource,
    example: LeadSource.INSTAGRAM,
  })
  @IsEnum(LeadSource)
  source: LeadSource;

  @ApiProperty({
    description: "Course ID the lead is interested in",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({
    description: "Admin ID who created the lead",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  admin_id: string;

  @ApiProperty({
    description: "Additional notes about the lead",
    example: "Called at 2pm, interested in evening classes",
  })
  @IsString()
  @IsOptional()
  notes: string;
}
