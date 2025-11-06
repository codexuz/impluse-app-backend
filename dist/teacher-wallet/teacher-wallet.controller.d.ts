import { TeacherWalletService } from './teacher-wallet.service.js';
import { CreateTeacherWalletDto } from './dto/create-teacher-wallet.dto.js';
import { UpdateTeacherWalletDto } from './dto/update-teacher-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
export declare class TeacherWalletController {
    private readonly teacherWalletService;
    constructor(teacherWalletService: TeacherWalletService);
    create(createTeacherWalletDto: CreateTeacherWalletDto): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet>;
    findAll(): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet[]>;
    findByTeacherId(teacherId: string): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet>;
    findOne(id: string): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet>;
    update(id: string, updateTeacherWalletDto: UpdateTeacherWalletDto): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet>;
    updateAmount(id: string, updateWalletAmountDto: UpdateWalletAmountDto): Promise<import("./entities/teacher-wallet.entity.js").TeacherWallet>;
    remove(id: string): Promise<void>;
}
