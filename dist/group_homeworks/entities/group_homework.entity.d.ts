import { Model } from 'sequelize-typescript';
export declare class GroupHomework extends Model {
    id: string;
    lesson_id: string;
    group_id: string;
    teacher_id: string;
    title: string;
    start_date: Date;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
}
