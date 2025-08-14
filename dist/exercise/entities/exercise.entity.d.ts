import { Model } from 'sequelize-typescript';
export declare class Exercise extends Model {
    id: string;
    title: string;
    exercise_type: string;
    audio_url: string;
    image_url: string;
    instructions: string;
    content: string;
    isActive: boolean;
    lessonId: string;
    createdAt: Date;
    updatedAt: Date;
}
