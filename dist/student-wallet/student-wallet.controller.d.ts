import { StudentWalletService } from './student-wallet.service.js';
import { CreateStudentWalletDto } from './dto/create-student-wallet.dto.js';
import { UpdateStudentWalletDto } from './dto/update-student-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
export declare class StudentWalletController {
    private readonly studentWalletService;
    constructor(studentWalletService: StudentWalletService);
    create(createStudentWalletDto: CreateStudentWalletDto): Promise<import("./entities/student-wallet.entity.js").StudentWallet>;
    findAll(): Promise<import("./entities/student-wallet.entity.js").StudentWallet[]>;
    findByStudentId(studentId: string): Promise<import("./entities/student-wallet.entity.js").StudentWallet>;
    findOne(id: string): Promise<import("./entities/student-wallet.entity.js").StudentWallet>;
    update(id: string, updateStudentWalletDto: UpdateStudentWalletDto): Promise<import("./entities/student-wallet.entity.js").StudentWallet>;
    updateAmount(id: string, updateWalletAmountDto: UpdateWalletAmountDto): Promise<import("./entities/student-wallet.entity.js").StudentWallet>;
    remove(id: string): Promise<void>;
}
