import { Model } from "sequelize-typescript";
export declare class GroupChat extends Model {
    id: string;
    name: string;
    description: string;
    image_url: string;
    link: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}
