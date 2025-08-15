import { Model } from "sequelize-typescript";
export declare class LeadTrialLesson extends Model {
    id: string;
    scheduledAt: Date;
    status: string;
    teacher_id: string;
    lead_id: string;
    notes: string;
}
