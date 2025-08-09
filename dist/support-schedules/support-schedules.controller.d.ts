import { SupportSchedulesService } from './support-schedules.service.js';
import { CreateSupportScheduleDto, UpdateSupportScheduleDto } from './dto/index.js';
export declare class SupportSchedulesController {
    private readonly supportSchedulesService;
    constructor(supportSchedulesService: SupportSchedulesService);
    create(createSupportScheduleDto: CreateSupportScheduleDto): Promise<import("./entities/support-schedule.entity.js").SupportSchedule>;
    findAll(): Promise<import("./entities/support-schedule.entity.js").SupportSchedule[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/support-schedule.entity.js").SupportSchedule[]>;
    findByGroup(groupId: string): Promise<import("./entities/support-schedule.entity.js").SupportSchedule[]>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./entities/support-schedule.entity.js").SupportSchedule[]>;
    getStats(): Promise<{
        totalSchedules: number;
        upcomingSchedules: number;
        pastSchedules: number;
    }>;
    findOne(id: string): Promise<import("./entities/support-schedule.entity.js").SupportSchedule>;
    update(id: string, updateSupportScheduleDto: UpdateSupportScheduleDto): Promise<import("./entities/support-schedule.entity.js").SupportSchedule>;
    remove(id: string): Promise<void>;
}
