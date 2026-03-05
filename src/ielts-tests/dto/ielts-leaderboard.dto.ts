import { IsEnum, IsOptional, IsInt, Min, Max, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum LeaderboardPeriod {
    ALL_TIME = "all_time",
    MONTHLY = "monthly",
    WEEKLY = "weekly",
    DAILY = "daily",
}

export class LeaderboardQueryDto {

    @ApiPropertyOptional({ enum: LeaderboardPeriod, default: LeaderboardPeriod.ALL_TIME })
    @IsEnum(LeaderboardPeriod)
    @IsOptional()
    period?: LeaderboardPeriod = LeaderboardPeriod.ALL_TIME;

    @ApiPropertyOptional({ default: 10 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional({ default: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    offset?: number = 0;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    group_id?: string;
}
