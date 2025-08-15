import { Model } from 'sequelize-typescript';
import { Role } from './role.model.js';
import { UserSession } from './user-session.model.js';
export declare class User extends Model<User> {
    user_id: string;
    username: string;
    password_hash: string;
    level_id?: string;
    phone?: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    is_active: boolean;
    created_at: Date;
    last_login?: Date;
    currentSessionId: string;
    roles: Role[];
    sessions: UserSession[];
}
