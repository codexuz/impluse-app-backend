import { UsersService } from "./users.service.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdatePasswordDto } from "./dto/update-password.dto.js";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createTeacher(createTeacherDto: CreateTeacherDto): Promise<import("./entities/user.entity.js").User>;
    createAdmin(createAdminDto: CreateAdminDto): Promise<import("./entities/user.entity.js").User>;
    getAllTeachers(): Promise<import("./entities/user.entity.js").User[]>;
    getAllAdmins(): Promise<import("./entities/user.entity.js").User[]>;
    getAllStudents(): Promise<import("./entities/user.entity.js").User[]>;
    getArchivedStudents(): Promise<import("./entities/user.entity.js").User[]>;
    getAllSupportTeachers(): Promise<import("./entities/user.entity.js").User[]>;
    findAll(): Promise<import("./entities/user.entity.js").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity.js").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity.js").User>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<import("./entities/user.entity.js").User>;
    activate(id: string): Promise<import("./entities/user.entity.js").User>;
    archiveStudent(id: string): Promise<import("./entities/user.entity.js").User>;
    restoreStudent(id: string): Promise<import("./entities/user.entity.js").User>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<import("./entities/user.entity.js").User>;
}
