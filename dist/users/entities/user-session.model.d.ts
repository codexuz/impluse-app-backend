import { Model } from 'sequelize-typescript';
export declare class UserSession extends Model {
    id: string;
    userId: string;
    jwtToken: string;
    userAgent: string;
    ipAddress: string;
    expiresAt: Date;
    isActive: boolean;
    lastAccessedAt: Date;
    refreshToken: string;
    refreshTokenExpiresAt: Date;
}
