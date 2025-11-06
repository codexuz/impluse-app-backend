import { Model } from 'sequelize-typescript';
export declare class CdIelts extends Model {
    id: string;
    title: string;
    status: String;
    exam_date: Date;
    time: string;
    location: string;
    seats: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
