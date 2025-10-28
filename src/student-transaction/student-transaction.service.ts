import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStudentTransactionDto } from './dto/create-student-transaction.dto.js';
import { UpdateStudentTransactionDto } from './dto/update-student-transaction.dto.js';
import { StudentTransaction } from './entities/student-transaction.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class StudentTransactionService {
  constructor(
    @InjectModel(StudentTransaction)
    private studentTransactionModel: typeof StudentTransaction,
  ) {}

  async create(createStudentTransactionDto: CreateStudentTransactionDto): Promise<StudentTransaction> {
    return await this.studentTransactionModel.create(createStudentTransactionDto as any);
  }

  async findAll(type?: string): Promise<StudentTransaction[]> {
    const whereCondition: any = {};
    
    if (type) {
      whereCondition.type = type;
    }

    return await this.studentTransactionModel.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
    });
  }

  async findByStudentId(studentId: string, type?: string): Promise<StudentTransaction[]> {
    const whereCondition: any = { student_id: studentId };
    
    if (type) {
      whereCondition.type = type;
    }

    const transactions = await this.studentTransactionModel.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(`No transactions found for student with ID "${studentId}"`);
    }

    return transactions;
  }

  async findOne(id: string): Promise<StudentTransaction> {
    const transaction = await this.studentTransactionModel.findByPk(id);

    if (!transaction) {
      throw new NotFoundException(`Student transaction with ID "${id}" not found`);
    }

    return transaction;
  }

  async update(id: string, updateStudentTransactionDto: UpdateStudentTransactionDto): Promise<StudentTransaction> {
    const transaction = await this.findOne(id);

    await transaction.update(updateStudentTransactionDto as any);

    return transaction;
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    
    await transaction.destroy(); // Soft delete since paranoid is enabled
  }
}
