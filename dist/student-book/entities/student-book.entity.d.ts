import { Model } from "sequelize-typescript";
export declare class StudentBook extends Model {
    id: string;
    level_id: string;
    title: string;
    image_url: string;
    createdAt: Date;
    updatedAt: Date;
}
