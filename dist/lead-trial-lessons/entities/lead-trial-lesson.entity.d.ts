import { Model } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { Lead } from "../../leads/entities/lead.entity.js";
export declare class LeadTrialLesson extends Model {
    id: string;
    scheduledAt: Date;
    status: string;
    teacher_id: string;
    teacherInfo: User;
    lead_id: string;
    leadInfo: Lead;
    notes: string;
}
