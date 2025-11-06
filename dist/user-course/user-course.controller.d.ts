import { UserCourseService } from './user-course.service.js';
import { CreateUserCourseDto } from './dto/create-user-course.dto.js';
import { UpdateUserCourseDto } from './dto/update-user-course.dto.js';
export declare class UserCourseController {
    private readonly userCourseService;
    constructor(userCourseService: UserCourseService);
    create(createUserCourseDto: CreateUserCourseDto): Promise<import("./entities/user-course.entity.js").UserCourse>;
    findAll(userId?: string, courseId?: string): Promise<import("./entities/user-course.entity.js").UserCourse[]>;
    findOne(id: string): Promise<import("./entities/user-course.entity.js").UserCourse>;
    findByUserAndCourse(userId: string, courseId: string): Promise<import("./entities/user-course.entity.js").UserCourse>;
    update(id: string, updateUserCourseDto: UpdateUserCourseDto): Promise<import("./entities/user-course.entity.js").UserCourse>;
    remove(id: string): Promise<void>;
}
