import { Model } from 'sequelize-typescript';
import { User } from './user.entity.js';
import { Permission } from './permission.model.js';
export declare class Role extends Model {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    users: User[];
    permissions: Permission[];
}
