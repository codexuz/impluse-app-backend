import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTeacherTransactionDto } from './dto/create-teacher-transaction.dto.js';
import { UpdateTeacherTransactionDto } from './dto/update-teacher-transaction.dto.js';
import { TeacherTransaction } from './entities/teacher-transaction.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class TeacherTransactionService {
  constructor(
    @InjectModel(TeacherTransaction)
    private teacherTransactionModel: typeof TeacherTransaction,
  ) {}

  async create(createTeacherTransactionDto: CreateTeacherTransactionDto): Promise<TeacherTransaction> {
    return await this.teacherTransactionModel.create(createTeacherTransactionDto as any);
  }

  async findAll(type?: string): Promise<TeacherTransaction[]> {
    const whereCondition: any = {};
    
    if (type) {
      whereCondition.type = type;
    }

    return await this.teacherTransactionModel.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
    });
  }

  async findByTeacherId(teacherId: string, type?: string): Promise<TeacherTransaction[]> {
    const whereCondition: any = { teacher_id: teacherId };
    
    if (type) {
      whereCondition.type = type;
    }

    const transactions = await this.teacherTransactionModel.findAll({
      where: whereCondition,
      order: [['created_at', 'DESC']],
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(`No transactions found for teacher with ID "${teacherId}"`);
    }

    return transactions;
  }

  async findOne(id: string): Promise<TeacherTransaction> {
    const transaction = await this.teacherTransactionModel.findByPk(id);

    if (!transaction) {
      throw new NotFoundException(`Teacher transaction with ID "${id}" not found`);
    }

    return transaction;
  }

  async update(id: string, updateTeacherTransactionDto: UpdateTeacherTransactionDto): Promise<TeacherTransaction> {
    const transaction = await this.findOne(id);

    await transaction.update(updateTeacherTransactionDto as any);

    return transaction;
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);
    
    await transaction.destroy(); // Soft delete since paranoid is enabled
  }
}
