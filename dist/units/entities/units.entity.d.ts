import { Model } from 'sequelize-typescript';
export declare class Unit extends Model {
    id: string;
    title: string;
    description: string;
    order: number;
    isActive: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}
