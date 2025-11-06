import { Model } from "sequelize-typescript";
export declare class LessonSchedule extends Model<LessonSchedule> {
    id: string;
    group_id: string;
    room_number: string;
    day_time: string;
    start_time: Date;
    end_time: Date;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
