import { CdIeltsService } from './cd-ielts.service.js';
import { CreateCdIeltDto } from './dto/create-cd-ielt.dto.js';
import { UpdateCdIeltDto } from './dto/update-cd-ielt.dto.js';
import { CreateCdRegisterDto } from './dto/create-cd-register.dto.js';
import { UpdateCdRegisterDto } from './dto/update-cd-register.dto.js';
export declare class CdIeltsController {
    private readonly cdIeltsService;
    constructor(cdIeltsService: CdIeltsService);
    createTest(createCdIeltDto: CreateCdIeltDto): Promise<import("./entities/cd-ielt.entity.js").CdIelts>;
    findAllTests(): Promise<any[]>;
    findActiveTests(): Promise<any[]>;
    findOneTest(id: string): Promise<any>;
    updateTest(id: string, updateCdIeltDto: UpdateCdIeltDto): Promise<any>;
    removeTest(id: string): Promise<void>;
    register(createCdRegisterDto: CreateCdRegisterDto): Promise<import("./entities/cd-register.entity.js").CdRegister>;
    findAllRegistrations(): Promise<any[]>;
    findRegistrationsByTest(testId: string): Promise<any[]>;
    findRegistrationsByStudent(studentId: string): Promise<any[]>;
    findOneRegistration(id: string): Promise<any>;
    updateRegistration(id: string, updateCdRegisterDto: UpdateCdRegisterDto): Promise<import("./entities/cd-register.entity.js").CdRegister>;
    removeRegistration(id: string): Promise<void>;
}
