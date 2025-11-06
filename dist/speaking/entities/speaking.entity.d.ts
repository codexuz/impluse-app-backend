import { Model } from "sequelize-typescript";
export declare class Speaking extends Model {
    id: string;
    lessonId: string;
    title: string;
    type: string;
}
