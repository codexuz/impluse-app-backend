import { Model } from 'sequelize-typescript';
export declare class Book extends Model<Book> {
    id: string;
    title: string;
    author: string;
    thumbnail: string;
    url: string;
    level: string;
    views: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
