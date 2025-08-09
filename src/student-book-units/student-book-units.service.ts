import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentBookUnit } from './entities/student-book-unit.entity.js';
import { CreateStudentBookUnitDto } from './dto/create-student-book-unit.dto.js';
import { UpdateStudentBookUnitDto } from './dto/update-student-book-unit.dto.js';

@Injectable()
export class StudentBookUnitsService {
  constructor(
    @InjectModel(StudentBookUnit)
    private studentBookUnitModel: typeof StudentBookUnit,
  ) {}

  async create(createStudentBookUnitDto: CreateStudentBookUnitDto) {
    return await this.studentBookUnitModel.create({
      ...createStudentBookUnitDto,
    });
  }

  async findAll() {
    return await this.studentBookUnitModel.findAll();
  }

  async findOne(id: string) {
    const unit = await this.studentBookUnitModel.findByPk(id);
    if (!unit) {
      throw new NotFoundException('Student book unit not found');
    }
    return unit;
  }

  async update(id: string, updateStudentBookUnitDto: UpdateStudentBookUnitDto) {
    const unit = await this.findOne(id);
    return await unit.update(updateStudentBookUnitDto);
  }

  async remove(id: string) {
    const unit = await this.findOne(id);
    await unit.destroy();
    return { id };
  }
}