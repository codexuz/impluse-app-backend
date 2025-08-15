import { Model } from "sequelize-typescript";
export declare class Story extends Model {
    id: string;
    title: string;
    url: string;
    image_url: string;
    isPublished: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
