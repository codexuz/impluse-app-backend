import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsBoolean } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  courseId?: string;
}

