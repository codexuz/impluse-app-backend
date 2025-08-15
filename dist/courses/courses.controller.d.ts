import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto): Promise<import("./entities/course.entity.js").Course>;
    findAll(): Promise<import("./entities/course.entity.js").Course[]>;
    getCourseProgress(studentId: string): Promise<{
        course_id: string;
        course_name: string;
        completed: number;
        total: number;
        percentage: number;
    }>;
    findOne(id: string): Promise<import("./entities/course.entity.js").Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<import("./entities/course.entity.js").Course>;
    remove(id: string): Promise<void>;
    hardRemove(id: string): Promise<void>;
}
