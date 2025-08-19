import { Model } from "sequelize-typescript";
export declare class Choices extends Model {
    id: string;
    question_id: string;
    option_text: string;
    is_correct: boolean;
}
