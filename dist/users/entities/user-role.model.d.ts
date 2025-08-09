import { Model } from 'sequelize-typescript';
export declare class UserRole extends Model {
    userId: string;
    roleId: number;
    assignedAt: Date;
    expiresAt: Date;
}
