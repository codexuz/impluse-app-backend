import { Model } from 'sequelize-typescript';
export declare class Permission extends Model {
    id: number;
    name: string;
    resource: string;
    action: string;
    description: string;
}
