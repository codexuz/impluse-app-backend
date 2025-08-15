import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from './entities/role.model.js';
import { StudentProfile } from '../student_profiles/entities/student_profile.entity.js';
export declare class UsersService {
    private userModel;
    private roleModel;
    private studentProfileModel;
    constructor(userModel: typeof User, roleModel: typeof Role, studentProfileModel: typeof StudentProfile);
    private checkExistingUser;
    private hashPassword;
    createTeacher(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<User>;
    activate(id: string): Promise<User>;
    getAllTeachers(): Promise<User[]>;
    getAllStudents(): Promise<User[]>;
    getAllSupportTeachers(): Promise<User[]>;
}
