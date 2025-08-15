import { Model } from "sequelize-typescript";
export declare class Exam extends Model<Exam> {
    id: string;
    title: string;
    group_id: string;
    scheduled_at: Date;
    status: "scheduled" | "completed" | "cancelled";
    is_online: boolean;
    level: "beginner" | 'elementary' | "pre-intermediate" | "intermediate";
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
