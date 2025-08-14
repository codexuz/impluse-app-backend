import { Model } from "sequelize-typescript";
export declare class Speaking extends Model {
    id: string;
    lessonId: string;
    topic: string;
    content: string;
    instruction: string;
    level: string;
    type: string;
}
