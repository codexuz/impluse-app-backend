import { Model } from 'sequelize-typescript';
export declare class Response extends Model {
    id: string;
    form_id: string;
    answers: any;
    createdAt: Date;
    updatedAt: Date;
}
