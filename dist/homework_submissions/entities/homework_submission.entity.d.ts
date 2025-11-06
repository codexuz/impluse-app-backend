import { Model } from "sequelize-typescript";
export declare class HomeworkSubmission extends Model {
    id: string;
    homework_id: string;
    student_id: string;
    lesson_id: string;
    createdAt: Date;
    updatedAt: Date;
}
