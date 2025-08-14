import { Model } from "sequelize-typescript";
export declare class SupportSchedule extends Model {
    id: string;
    support_teacher_id: string;
    group_id: string;
    schedule_date: Date;
    start_time: Date;
    end_time: Date;
    topic: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
