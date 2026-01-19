import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateTeacherWalletDto } from "./dto/create-teacher-wallet.dto.js";
import { UpdateTeacherWalletDto } from "./dto/update-teacher-wallet.dto.js";
import { UpdateWalletAmountDto } from "./dto/update-wallet-amount.dto.js";
import { TeacherWallet } from "./entities/teacher-wallet.entity.js";

@Injectable()
export class TeacherWalletService {
  constructor(
    @InjectModel(TeacherWallet)
    private teacherWalletModel: typeof TeacherWallet,
  ) {}

  async create(
    createTeacherWalletDto: CreateTeacherWalletDto,
  ): Promise<TeacherWallet> {
    // Check if wallet already exists for this teacher
    const existingWallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: createTeacherWalletDto.teacher_id },
    });

    if (existingWallet) {
      throw new ConflictException("Wallet already exists for this teacher");
    }

    return await this.teacherWalletModel.create(createTeacherWalletDto as any);
  }

  async findAll(): Promise<TeacherWallet[]> {
    return await this.teacherWalletModel.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async findByTeacherId(teacherId: string): Promise<TeacherWallet> {
    const wallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: teacherId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for teacher with ID "${teacherId}" not found`,
      );
    }

    return wallet;
  }

  async findOne(id: string): Promise<TeacherWallet> {
    const wallet = await this.teacherWalletModel.findByPk(id);

    if (!wallet) {
      throw new NotFoundException(`Teacher wallet with ID "${id}" not found`);
    }

    return wallet;
  }

  async update(
    id: string,
    updateTeacherWalletDto: UpdateTeacherWalletDto,
  ): Promise<TeacherWallet> {
    const wallet = await this.findOne(id);

    await wallet.update(updateTeacherWalletDto as any);

    return wallet;
  }

  async updateAmount(
    id: string,
    updateWalletAmountDto: UpdateWalletAmountDto,
  ): Promise<TeacherWallet> {
    const wallet = await this.findOne(id);

    const newAmount = wallet.amount + updateWalletAmountDto.amount;

    if (newAmount < 0) {
      throw new BadRequestException("Insufficient wallet balance");
    }

    await wallet.update({ amount: newAmount });

    return wallet;
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.findOne(id);

    await wallet.destroy(); // Soft delete since paranoid is enabled
  }
}
