import { CreateUserCourseDto } from './dto/create-user-course.dto.js';
import { UpdateUserCourseDto } from './dto/update-user-course.dto.js';
import { UserCourse } from './entities/user-course.entity.js';
export declare class UserCourseService {
    private userCourseModel;
    constructor(userCourseModel: typeof UserCourse);
    create(createUserCourseDto: CreateUserCourseDto): Promise<UserCourse>;
    findAll(): Promise<UserCourse[]>;
    findAllByUserId(userId: string): Promise<UserCourse[]>;
    findAllByCourseId(courseId: string): Promise<UserCourse[]>;
    findOne(id: string): Promise<UserCourse>;
    update(id: string, updateUserCourseDto: UpdateUserCourseDto): Promise<UserCourse>;
    remove(id: string): Promise<void>;
    findByUserAndCourse(userId: string, courseId: string): Promise<UserCourse>;
}
