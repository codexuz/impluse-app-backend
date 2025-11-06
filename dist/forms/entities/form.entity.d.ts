import { Model } from 'sequelize-typescript';
export declare class Form extends Model {
    id: string;
    title: string;
    schema: any;
    createdAt: Date;
    updatedAt: Date;
}
