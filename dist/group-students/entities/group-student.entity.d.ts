import { Model } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity.js';
import { Group } from '../../groups/entities/group.entity.js';
export declare class GroupStudent extends Model {
    id: string;
    group_id: string;
    group: Group;
    student_id: string;
    student: User;
    enrolled_at: Date;
    status: String;
    createdAt: Date;
    updatedAt: Date;
}
