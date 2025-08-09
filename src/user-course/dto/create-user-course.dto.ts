import { IsUUID, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserCourseDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    courseId: string;

    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean = false;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    completedAt?: Date;
}
