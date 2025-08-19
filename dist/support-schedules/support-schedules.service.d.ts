import { CreateSupportScheduleDto, UpdateSupportScheduleDto } from './dto/index.js';
import { SupportSchedule } from './entities/support-schedule.entity.js';
export declare class SupportSchedulesService {
    private supportScheduleModel;
    constructor(supportScheduleModel: typeof SupportSchedule);
    create(createSupportScheduleDto: CreateSupportScheduleDto): Promise<SupportSchedule>;
    findAll(): Promise<SupportSchedule[]>;
    findOne(id: string): Promise<SupportSchedule>;
    findByTeacher(teacherId: string): Promise<SupportSchedule[]>;
    findByGroup(groupId: string): Promise<SupportSchedule[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<SupportSchedule[]>;
    update(id: string, updateSupportScheduleDto: UpdateSupportScheduleDto): Promise<SupportSchedule>;
    remove(id: string): Promise<void>;
    getScheduleStats(): Promise<{
        totalSchedules: number;
        upcomingSchedules: number;
        pastSchedules: number;
    }>;
}
