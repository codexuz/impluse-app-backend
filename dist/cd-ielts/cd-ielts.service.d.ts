import { CdIelts } from './entities/cd-ielt.entity.js';
import { CdRegister } from './entities/cd-register.entity.js';
import { CreateCdIeltDto } from './dto/create-cd-ielt.dto.js';
import { UpdateCdIeltDto } from './dto/update-cd-ielt.dto.js';
import { CreateCdRegisterDto } from './dto/create-cd-register.dto.js';
import { UpdateCdRegisterDto } from './dto/update-cd-register.dto.js';
import { User } from '../users/entities/user.entity.js';
export declare class CdIeltsService {
    private cdIeltsModel;
    private cdRegisterModel;
    private userModel;
    constructor(cdIeltsModel: typeof CdIelts, cdRegisterModel: typeof CdRegister, userModel: typeof User);
    createTest(createCdIeltDto: CreateCdIeltDto): Promise<CdIelts>;
    findAllTests(): Promise<any[]>;
    findActiveTests(): Promise<any[]>;
    findOneTest(id: string): Promise<any>;
    updateTest(id: string, updateCdIeltDto: UpdateCdIeltDto): Promise<any>;
    removeTest(id: string): Promise<void>;
    registerForTest(createCdRegisterDto: CreateCdRegisterDto): Promise<CdRegister>;
    findAllRegistrations(): Promise<any[]>;
    findRegistrationsByTest(testId: string): Promise<any[]>;
    findRegistrationsByStudent(studentId: string): Promise<any[]>;
    findOneRegistration(id: string): Promise<any>;
    updateRegistration(id: string, updateCdRegisterDto: UpdateCdRegisterDto): Promise<CdRegister>;
    removeRegistration(id: string): Promise<void>;
}
