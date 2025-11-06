import { CreateTeacherWalletDto } from './dto/create-teacher-wallet.dto.js';
import { UpdateTeacherWalletDto } from './dto/update-teacher-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { TeacherWallet } from './entities/teacher-wallet.entity.js';
export declare class TeacherWalletService {
    private teacherWalletModel;
    constructor(teacherWalletModel: typeof TeacherWallet);
    create(createTeacherWalletDto: CreateTeacherWalletDto): Promise<TeacherWallet>;
    findAll(): Promise<TeacherWallet[]>;
    findByTeacherId(teacherId: string): Promise<TeacherWallet>;
    findOne(id: string): Promise<TeacherWallet>;
    update(id: string, updateTeacherWalletDto: UpdateTeacherWalletDto): Promise<TeacherWallet>;
    updateAmount(id: string, updateWalletAmountDto: UpdateWalletAmountDto): Promise<TeacherWallet>;
    remove(id: string): Promise<void>;
}
