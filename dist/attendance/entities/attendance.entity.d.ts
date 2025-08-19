import { Model } from "sequelize-typescript";
export declare class Attendance extends Model {
    id: string;
    group_id: string;
    student_id: string;
    teacher_id: string;
    status: string;
    note: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
