import { Model } from 'sequelize-typescript';
export declare class Movie extends Model<Movie> {
    id: string;
    title: string;
    genre: string;
    type: string;
    thumbnail: string;
    url: string;
    level: string;
    views: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
