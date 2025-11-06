import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
export declare class LessonSchedulesService {
    create(createLessonScheduleDto: CreateLessonScheduleDto): Promise<LessonSchedule>;
    findAll(): Promise<LessonSchedule[]>;
    findOne(id: string): Promise<LessonSchedule>;
    findByGroupId(groupId: string): Promise<LessonSchedule[]>;
    update(id: string, updateLessonScheduleDto: UpdateLessonScheduleDto): Promise<LessonSchedule>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    findActiveSchedules(): Promise<LessonSchedule[]>;
}
