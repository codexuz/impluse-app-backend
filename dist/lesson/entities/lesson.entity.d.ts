import { Model } from 'sequelize-typescript';
export interface LessonAttributes {
    id: string;
    title: string;
    order: number;
    isActive: boolean;
    type: 'lesson' | 'practice' | 'test';
    moduleId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface LessonCreationAttributes {
    title: string;
    order: number;
    isActive?: boolean;
    type?: 'lesson' | 'practice' | 'test';
    moduleId?: string;
}
export declare class Lesson extends Model<LessonAttributes, LessonCreationAttributes> {
    id: string;
    title: string;
    order: number;
    isActive: boolean;
    type: 'lesson' | 'practice' | 'test';
    moduleId?: string;
    createdAt: Date;
    updatedAt: Date;
}
