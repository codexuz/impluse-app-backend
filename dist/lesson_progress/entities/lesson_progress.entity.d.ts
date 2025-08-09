import { Model } from "sequelize-typescript";
import { Lesson } from "../../lesson/entities/lesson.entity.js";
export declare class LessonProgress extends Model {
    id: string;
    student_id: string;
    lesson_id: string;
    lesson: Lesson;
    completed: boolean;
    progress_percentage: number;
    reading_completed: boolean;
    listening_completed: boolean;
    grammar_completed: boolean;
    writing_completed: boolean;
    speaking_completed: boolean;
    completed_sections_count: number;
    total_sections_count: number;
    createdAt: Date;
    updatedAt: Date;
}
