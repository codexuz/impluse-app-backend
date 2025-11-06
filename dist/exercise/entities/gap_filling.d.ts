import { Model } from "sequelize-typescript";
export declare class GapFilling extends Model {
    id: string;
    question_id: string;
    gap_number: number;
    correct_answer: string[];
}
