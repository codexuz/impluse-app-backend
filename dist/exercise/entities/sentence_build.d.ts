import { Model } from "sequelize-typescript";
export declare class SentenceBuild extends Model {
    id: string;
    question_id: string;
    given_text: string;
    correct_answer: string;
}
