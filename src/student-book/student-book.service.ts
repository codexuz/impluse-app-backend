import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentBook } from './entities/student-book.entity.js';
import { CreateStudentBookDto } from './dto/create-student-book.dto.js';
import { UpdateStudentBookDto } from './dto/update-student-book.dto.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class StudentBookService {
  constructor(
    @InjectModel(StudentBook)
    private studentBookModel: typeof StudentBook,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createStudentBookDto: CreateStudentBookDto): Promise<StudentBook> {
    return this.studentBookModel.create({ ...createStudentBookDto });
  }

  async findAll(): Promise<StudentBook[]> {
    return this.studentBookModel.findAll();
  }

  async findOne(id: string): Promise<StudentBook> {
    const studentBook = await this.studentBookModel.findByPk(id);
    if (!studentBook) {
      throw new NotFoundException('Student book not found');
    }
    return studentBook;
  }

  async findByStudentId(studentId: string): Promise<StudentBook[]> {
    // First, find the student and get their level_id
    const user = await this.userModel.findByPk(studentId, {
      attributes: ['level_id']
    });

    if (!user || !user.level_id) {
      return []; // Return empty array if student not found or has no level assigned
    }

    // Find books where level_id matches the student's level
    return this.studentBookModel.findAll({
      where: {
        level_id: user.level_id
      }
    });
  }

  async findByStudentAndLevel(studentId: string, levelId: string): Promise<StudentBook[]> {
    // First, verify that the student's level matches the requested level
    const user = await this.userModel.findByPk(studentId, {
      attributes: ['level_id']
    });

    if (!user) {
      throw new NotFoundException('Student not found');
    }

    if (user.level_id !== levelId) {
      throw new NotFoundException('Student is not assigned to the specified level');
    }

    // Find books for this specific level
    return this.studentBookModel.findAll({
      where: {
        level_id: levelId
      }
    });
  }

  async update(id: string, updateStudentBookDto: UpdateStudentBookDto): Promise<StudentBook> {
    const studentBook = await this.findOne(id);
    await studentBook.update(updateStudentBookDto);
    return studentBook;
  }

  async remove(id: string): Promise<void> {
    const studentBook = await this.findOne(id);
    await studentBook.destroy();
  }
}