import { Model } from "sequelize-typescript";
export declare class HomeworkSubmission extends Model {
    id: string;
    homework_id: string;
    student_id: string;
    lesson_id: string;
    exercise_id: string;
    percentage: number;
    status: string;
    section: string;
    file_url: string;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}
