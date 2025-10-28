import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudentWalletDto } from './dto/create-student-wallet.dto.js';
import { UpdateStudentWalletDto } from './dto/update-student-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { StudentWallet } from './entities/student-wallet.entity.js';

@Injectable()
export class StudentWalletService {
  constructor(
    @InjectModel(StudentWallet)
    private studentWalletModel: typeof StudentWallet,
  ) {}

  async create(createStudentWalletDto: CreateStudentWalletDto): Promise<StudentWallet> {
    // Check if wallet already exists for this student
    const existingWallet = await this.studentWalletModel.findOne({
      where: { student_id: createStudentWalletDto.student_id },
    });

    if (existingWallet) {
      throw new ConflictException('Wallet already exists for this student');
    }

    return await this.studentWalletModel.create(createStudentWalletDto as any);
  }

  async findAll(): Promise<StudentWallet[]> {
    return await this.studentWalletModel.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async findByStudentId(studentId: string): Promise<StudentWallet> {
    const wallet = await this.studentWalletModel.findOne({
      where: { student_id: studentId },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet for student with ID "${studentId}" not found`);
    }

    return wallet;
  }

  async findOne(id: string): Promise<StudentWallet> {
    const wallet = await this.studentWalletModel.findByPk(id);

    if (!wallet) {
      throw new NotFoundException(`Student wallet with ID "${id}" not found`);
    }

    return wallet;
  }

  async update(id: string, updateStudentWalletDto: UpdateStudentWalletDto): Promise<StudentWallet> {
    const wallet = await this.findOne(id);

    await wallet.update(updateStudentWalletDto as any);

    return wallet;
  }

  async updateAmount(id: string, updateWalletAmountDto: UpdateWalletAmountDto): Promise<StudentWallet> {
    const wallet = await this.findOne(id);

    const newAmount = wallet.amount + updateWalletAmountDto.amount;

    if (newAmount < 0) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    await wallet.update({ amount: newAmount });

    return wallet;
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.findOne(id);
    
    await wallet.destroy(); // Soft delete since paranoid is enabled
  }
}
