import { IsOptional, IsInt, Min, IsString, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class GetTeachersWithStatsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  branch_id?: string;

  @IsOptional()
  @IsEnum(["percentage", "fixed"])
  payment_type?: "percentage" | "fixed";

  @IsOptional()
  @IsString()
  sortBy?: string = "created_at";

  @IsOptional()
  @IsEnum(["ASC", "DESC"])
  sortOrder?: "ASC" | "DESC" = "DESC";
}

export interface TeacherWithStats {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  branch_id: string;
  payment_type: "percentage" | "fixed";
  payment_value: number;
  groupsCount: number;
  studentsCount: number;
  walletBalance: number;
  compensateBalance: number;
  created_at: Date;
}

export interface TeachersWithStatsResponse {
  data: TeacherWithStats[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
