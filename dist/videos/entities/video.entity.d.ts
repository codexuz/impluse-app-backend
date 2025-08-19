import { Model } from "sequelize-typescript";
export declare class Video extends Model<Video> {
    id: string;
    title: string;
    description: string;
    url: string;
    level: string;
    subtitle: string;
    thumbnail: string;
    views: number;
    source: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
