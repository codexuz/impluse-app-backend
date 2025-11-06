import { LessonSchedulesService } from "./lesson-schedules.service.js";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
export declare class LessonSchedulesController {
    private readonly lessonSchedulesService;
    constructor(lessonSchedulesService: LessonSchedulesService);
    create(createLessonScheduleDto: CreateLessonScheduleDto): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule>;
    findAll(): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule[]>;
    findActiveSchedules(): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule[]>;
    findByGroup(groupId: string): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule[]>;
    findOne(id: string): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule>;
    update(id: string, updateLessonScheduleDto: UpdateLessonScheduleDto): Promise<import("./entities/lesson-schedule.entity.js").LessonSchedule>;
    remove(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
}
