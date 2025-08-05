import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';

@Injectable()
export class HomeworkSubmissionsService {
    constructor(
        @InjectModel(HomeworkSubmission)
        private homeworkSubmissionModel: typeof HomeworkSubmission,
    ) {}

    async create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission> {
        return await this.homeworkSubmissionModel.create({ ...createHomeworkSubmissionDto });
    }

    async findAll(): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll();
    }

    async findOne(id: string): Promise<HomeworkSubmission> {
        const submission = await this.homeworkSubmissionModel.findOne({ where: { id } });
        if (!submission) {
            throw new NotFoundException(`Homework submission with ID ${id} not found`);
        }
        return submission;
    }

    async findByHomeworkId(homeworkId: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            where: { homework_id: homeworkId }
        });
    }

    async findByStudentId(studentId: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            where: { student_id: studentId }
        });
    }

    async findByStudentAndHomework(studentId: string, homeworkId: string): Promise<HomeworkSubmission> {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: { 
                student_id: studentId,
                homework_id: homeworkId
            }
        });
        if (!submission) {
            throw new NotFoundException(`Homework submission not found for student ${studentId} and homework ${homeworkId}`);
        }
        return submission;
    }

    async update(id: string, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto): Promise<HomeworkSubmission> {
        const submission = await this.findOne(id);
        await submission.update(updateHomeworkSubmissionDto);
        return submission;
    }

    async updateFeedback(id: string, feedback: string): Promise<HomeworkSubmission> {
        const submission = await this.findOne(id);
        await submission.update({ feedback });
        return submission;
    }

    async updateStatus(id: string, status: string): Promise<HomeworkSubmission> {
        const submission = await this.findOne(id);
        await submission.update({ status });
        return submission;
    }

    async saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission> {
        // Check if a submission already exists for this student, homework, and section
        const existingSubmission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: createHomeworkSubmissionDto.student_id,
                homework_id: createHomeworkSubmissionDto.homework_id,
                section: createHomeworkSubmissionDto.section
            }
        });

        if (existingSubmission) {
            // Update existing submission
            await existingSubmission.update(createHomeworkSubmissionDto);
            return existingSubmission;
        }

        // Create new submission
        return await this.homeworkSubmissionModel.create({ ...createHomeworkSubmissionDto });
    }

    async findBySection(section: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            where: { section },
            order: [['createdAt', 'DESC']]
        });
    }

    async findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            where: { 
                student_id: studentId,
                section: section
            },
            order: [['createdAt', 'DESC']]
        });
    }

    async findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            where: {
                homework_id: homeworkId,
                section: section
            },
            order: [['createdAt', 'DESC']]
        });
    }

    async findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSubmission> {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId,
                section: section
            }
        });
        
        if (!submission) {
            throw new NotFoundException(`Homework submission not found for student ${studentId}, homework ${homeworkId}, and section ${section}`);
        }
        
        return submission;
    }

    async remove(id: string): Promise<void> {
        const submission = await this.findOne(id);
        await submission.destroy();
    }
}
