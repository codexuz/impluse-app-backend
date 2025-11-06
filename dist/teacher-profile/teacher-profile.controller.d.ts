import { TeacherProfileService } from './teacher-profile.service.js';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto.js';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto.js';
export declare class TeacherProfileController {
    private readonly teacherProfileService;
    constructor(teacherProfileService: TeacherProfileService);
    create(createTeacherProfileDto: CreateTeacherProfileDto): Promise<import("./entities/teacher-profile.entity.js").TeacherProfile>;
    findAll(): Promise<import("./entities/teacher-profile.entity.js").TeacherProfile[]>;
    findByUserId(userId: string): Promise<import("./entities/teacher-profile.entity.js").TeacherProfile>;
    findOne(id: string): Promise<import("./entities/teacher-profile.entity.js").TeacherProfile>;
    update(id: string, updateTeacherProfileDto: UpdateTeacherProfileDto): Promise<import("./entities/teacher-profile.entity.js").TeacherProfile>;
    remove(id: string): Promise<void>;
}
