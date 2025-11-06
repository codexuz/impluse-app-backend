import { Model } from "sequelize-typescript";
export declare class LessonContent extends Model {
    id: string;
    title: string;
    content: string;
    mediaUrl: string;
    mediaType: string;
    resources: string[];
    order_number: number;
    lessonId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
