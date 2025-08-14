import { Model } from "sequelize-typescript";
export declare class ExamResult extends Model<ExamResult> {
    id: string;
    exam_id: string;
    student_id: string;
    score: number;
    max_score: number;
    percentage: number;
    result: "passed" | "failed";
    section_scores: {
        reading?: number;
        writing?: number;
        listening?: number;
        speaking?: number;
        grammar?: number;
        vocabulary?: number;
    };
    feedback: string;
    is_completed: boolean;
    created_at: Date;
    updated_at: Date;
}
