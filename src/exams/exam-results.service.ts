import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExamResult } from './entities/exam_result.entity.js';
import { CreateExamResultDto } from './dto/create-exam-result.dto.js';
import { UpdateExamResultDto } from './dto/update-exam-result.dto.js';
import { Exam } from './entities/exam.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectModel(ExamResult)
    private examResultModel: typeof ExamResult,
    @InjectModel(Exam)
    private examModel: typeof Exam,
  ) {}

  async create(createExamResultDto: CreateExamResultDto): Promise<ExamResult> {
    // Check if the exam exists
    const exam = await this.examModel.findByPk(createExamResultDto.exam_id);
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${createExamResultDto.exam_id} not found`);
    }

    // Calculate percentage if not provided
    if (!createExamResultDto.percentage && createExamResultDto.score !== undefined && createExamResultDto.max_score) {
      createExamResultDto.percentage = (createExamResultDto.score / createExamResultDto.max_score) * 100;
    }

    // Determine pass/fail result if not provided
    if (!createExamResultDto.result && createExamResultDto.percentage !== undefined) {
      createExamResultDto.result = createExamResultDto.percentage >= 60 ? 'passed' : 'failed';
    }

    return this.examResultModel.create(createExamResultDto);
  }

  async findAll(): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
      ]
    });
  }

  async findOne(id: string): Promise<ExamResult> {
    const result = await this.examResultModel.findOne({
      where: { id },
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
      ]
    });

    if (!result) {
      throw new NotFoundException(`Exam result with ID ${id} not found`);
    }

    return result;
  }

  async findByExam(examId: string): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      where: { exam_id: examId },
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
      ]
    });
  }

  async findByStudent(studentId: string): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      where: { student_id: studentId },
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
      ]
    });
  }

  async findByExamAndStudent(examId: string, studentId: string): Promise<ExamResult> {
    const result = await this.examResultModel.findOne({
      where: {
        exam_id: examId,
        student_id: studentId
      },
      include: [
        { model: Exam, as: "exam" },
        { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
      ]
    });

    if (!result) {
      throw new NotFoundException(`Exam result for exam ${examId} and student ${studentId} not found`);
    }

    return result;
  }

  async update(id: string, updateExamResultDto: UpdateExamResultDto): Promise<ExamResult> {
    const result = await this.findOne(id);

    // Recalculate percentage if score or max_score is updated
    if ((updateExamResultDto.score !== undefined || updateExamResultDto.max_score !== undefined) && 
        (result.max_score || updateExamResultDto.max_score)) {
      const score = updateExamResultDto.score ?? result.score;
      const maxScore = updateExamResultDto.max_score ?? result.max_score;
      updateExamResultDto.percentage = (score / maxScore) * 100;
    }

    // Update pass/fail status if percentage is updated
    if (updateExamResultDto.percentage !== undefined) {
      updateExamResultDto.result = updateExamResultDto.percentage >= 60 ? 'passed' : 'failed';
    }

    await result.update(updateExamResultDto);
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.findOne(id);
    await result.destroy();
  }

  async getExamStatistics(examId: string): Promise<{
    totalStudents: number;
    averageScore: number;
    passRate: number;
    sectionAverages: { [key: string]: number };
  }> {
    const results = await this.findByExam(examId);
    
    if (results.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        passRate: 0,
        sectionAverages: {}
      };
    }

    const totalStudents = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / totalStudents;
    const passedCount = results.filter(result => result.result === 'passed').length;
    const passRate = (passedCount / totalStudents) * 100;

    // Calculate section averages
    const sectionTotals: { [key: string]: { sum: number; count: number } } = {};
    const sectionTypes = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'];

    results.forEach(result => {
      if (result.section_scores) {
        Object.entries(result.section_scores).forEach(([section, score]) => {
          if (!sectionTotals[section]) {
            sectionTotals[section] = { sum: 0, count: 0 };
          }
          sectionTotals[section].sum += score;
          sectionTotals[section].count += 1;
        });
      }
    });

    const sectionAverages: { [key: string]: number } = {};
    Object.entries(sectionTotals).forEach(([section, { sum, count }]) => {
      sectionAverages[section] = count > 0 ? sum / count : 0;
    });

    return {
      totalStudents,
      averageScore,
      passRate,
      sectionAverages
    };
  }
}
