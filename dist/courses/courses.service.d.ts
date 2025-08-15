import { Course } from "./entities/course.entity.js";
import { CreateCourseDto } from "./dto/create-course.dto.js";
import { UpdateCourseDto } from "./dto/update-course.dto.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { User } from "../users/entities/user.entity.js";
export declare class CoursesService {
    private courseModel;
    private userModel;
    private lessonProgressModel;
    constructor(courseModel: typeof Course, userModel: typeof User, lessonProgressModel: typeof LessonProgress);
    create(createCourseDto: CreateCourseDto): Promise<Course>;
    findAll(): Promise<Course[]>;
    getCourseProgress(student_id: string): Promise<{
        course_id: string;
        course_name: string;
        completed: number;
        total: number;
        percentage: number;
    }>;
    findOne(id: string): Promise<Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course>;
    remove(id: string): Promise<void>;
    hardRemove(id: string): Promise<void>;
}
