import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createTeacher(createUserDto: CreateUserDto): Promise<import("./entities/user.entity.js").User>;
    getAllTeachers(): Promise<import("./entities/user.entity.js").User[]>;
    getAllStudents(): Promise<import("./entities/user.entity.js").User[]>;
    getAllSupportTeachers(): Promise<import("./entities/user.entity.js").User[]>;
    findAll(): Promise<import("./entities/user.entity.js").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity.js").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity.js").User>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<import("./entities/user.entity.js").User>;
    activate(id: string): Promise<import("./entities/user.entity.js").User>;
}
