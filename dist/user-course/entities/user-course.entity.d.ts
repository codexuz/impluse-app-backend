import { Model } from 'sequelize-typescript';
export declare class UserCourse extends Model {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
    isCompleted: boolean;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
