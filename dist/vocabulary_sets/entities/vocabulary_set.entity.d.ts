import { Model } from 'sequelize-typescript';
export declare class VocabularySet extends Model {
    id: string;
    course_id: string;
    title: string;
    description: string;
    level: string;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
}
