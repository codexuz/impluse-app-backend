import { Model } from "sequelize-typescript";
export declare class Ieltspart1Question extends Model {
    id: string;
    speaking_id: string;
    question: string;
    audio_url: string;
    sample_answer: string;
}
