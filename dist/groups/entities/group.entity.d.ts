import { Model } from 'sequelize-typescript';
export declare class Group extends Model {
    id: string;
    name: string;
    teacher_id: string;
    level_id: string;
    createdAt: Date;
    updatedAt: Date;
}
