import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto.js';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto.js';
import { TeacherProfile } from './entities/teacher-profile.entity.js';
export declare class TeacherProfileService {
    private teacherProfileModel;
    constructor(teacherProfileModel: typeof TeacherProfile);
    create(createTeacherProfileDto: CreateTeacherProfileDto): Promise<TeacherProfile>;
    findAll(): Promise<TeacherProfile[]>;
    findByUserId(userId: string): Promise<TeacherProfile>;
    findOne(id: string): Promise<TeacherProfile>;
    update(id: string, updateTeacherProfileDto: UpdateTeacherProfileDto): Promise<TeacherProfile>;
    remove(id: string): Promise<void>;
}
