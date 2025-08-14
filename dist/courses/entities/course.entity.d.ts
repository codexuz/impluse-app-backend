import { Model } from 'sequelize-typescript';
export declare class Course extends Model {
    id: string;
    title: string;
    description: string;
    level: string;
    isActive: boolean;
}
