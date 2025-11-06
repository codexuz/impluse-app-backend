import { CreateStudentWalletDto } from './dto/create-student-wallet.dto.js';
import { UpdateStudentWalletDto } from './dto/update-student-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { StudentWallet } from './entities/student-wallet.entity.js';
export declare class StudentWalletService {
    private studentWalletModel;
    constructor(studentWalletModel: typeof StudentWallet);
    create(createStudentWalletDto: CreateStudentWalletDto): Promise<StudentWallet>;
    findAll(): Promise<StudentWallet[]>;
    findByStudentId(studentId: string): Promise<StudentWallet>;
    findOne(id: string): Promise<StudentWallet>;
    update(id: string, updateStudentWalletDto: UpdateStudentWalletDto): Promise<StudentWallet>;
    updateAmount(id: string, updateWalletAmountDto: UpdateWalletAmountDto): Promise<StudentWallet>;
    remove(id: string): Promise<void>;
}
