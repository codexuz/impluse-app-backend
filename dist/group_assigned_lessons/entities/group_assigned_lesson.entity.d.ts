import { Model } from 'sequelize-typescript';
export declare class GroupAssignedLesson extends Model {
    id: string;
    lesson_id: string;
    group_id: string;
    granted_by: string;
    group_assigned_unit_id: string;
    start_from: Date;
    end_at: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
