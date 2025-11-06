import { Model } from "sequelize-typescript";
export declare class HomeworkSection extends Model {
    id: string;
    submission_id: string;
    exercise_id: string;
    speaking_id: string;
    score: number;
    section: string;
    answers: {
        [key: string]: any;
    };
    createdAt: Date;
    updatedAt: Date;
}
