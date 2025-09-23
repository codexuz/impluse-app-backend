import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { HomeworkSection } from './entities/homework_sections.entity.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';
import { LessonProgressService } from '../lesson_progress/lesson_progress.service.js';

@Injectable()
export class HomeworkSubmissionsService {
    constructor(
        @InjectModel(HomeworkSubmission)
        private homeworkSubmissionModel: typeof HomeworkSubmission,
        @InjectModel(HomeworkSection)
        private homeworkSectionModel: typeof HomeworkSection,
        private lessonProgressService: LessonProgressService,
    ) {}

    async create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<{
        submission: HomeworkSubmission;
        section: HomeworkSection;
    }> {
        // Create the main homework submission
        const submission = await this.homeworkSubmissionModel.create({
            homework_id: createHomeworkSubmissionDto.homework_id,
            student_id: createHomeworkSubmissionDto.student_id,
            lesson_id: createHomeworkSubmissionDto.lesson_id,
        });

        // Create the homework section with answers and score
        const section = await this.homeworkSectionModel.create({
            submission_id: submission.id,
            exercise_id: createHomeworkSubmissionDto.exercise_id,
            score: createHomeworkSubmissionDto.percentage,
            section: createHomeworkSubmissionDto.section,
            answers: createHomeworkSubmissionDto.answers || {},
        });

        return { submission, section };
    }

    async findAll(): Promise<HomeworkSubmission[]> {
        return await this.homeworkSubmissionModel.findAll({
            include: [
                {
                    model: this.homeworkSectionModel,
                    as: 'sections'
                }
            ]
        });
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
        
        // Find all sections for this submission
        const sections = await this.homeworkSectionModel.findAll({
            where: { submission_id: submission.id }
        });

        // Update lesson progress if submission is passed
        if (status === 'passed' && submission.student_id && submission.homework_id) {
            for (const section of sections) {
                try {
                    await this.lessonProgressService.updateProgressFromHomeworkSubmission(
                        submission.student_id,
                        submission.homework_id,
                        section.section
                    );
                } catch (error) {
                    console.warn('Failed to update lesson progress:', error);
                    // Don't fail the status update if lesson progress update fails
                }
            }
        }

        return submission;
    }

    async saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<{
        submission: HomeworkSubmission;
        section: HomeworkSection;
    }> {
        // Check if a submission already exists for this student and homework
        let submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: createHomeworkSubmissionDto.student_id,
                homework_id: createHomeworkSubmissionDto.homework_id,
            }
        });

        if (!submission) {
            // Create new submission
            submission = await this.homeworkSubmissionModel.create({
                homework_id: createHomeworkSubmissionDto.homework_id,
                student_id: createHomeworkSubmissionDto.student_id,
                lesson_id: createHomeworkSubmissionDto.lesson_id,
            });
        }

        // Check if a section already exists for this submission and section type
        let section = await this.homeworkSectionModel.findOne({
            where: {
                submission_id: submission.id,
                section: createHomeworkSubmissionDto.section
            }
        });

        if (section) {
            // Update existing section
            await section.update({
                exercise_id: createHomeworkSubmissionDto.exercise_id,
                score: createHomeworkSubmissionDto.percentage,
                answers: createHomeworkSubmissionDto.answers || {}
            });
        } else {
            // Create new section
            section = await this.homeworkSectionModel.create({
                submission_id: submission.id,
                exercise_id: createHomeworkSubmissionDto.exercise_id,
                score: createHomeworkSubmissionDto.percentage,
                section: createHomeworkSubmissionDto.section,
                answers: createHomeworkSubmissionDto.answers || {}
            });
        }

        // Update lesson progress if submission section score indicates passing
        if (section.score && section.score >= 60 && submission.student_id && submission.homework_id) {
            try {
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(
                    submission.student_id,
                    submission.homework_id,
                    section.section
                );
            } catch (error) {
                console.warn('Failed to update lesson progress:', error);
                // Don't fail the homework submission if lesson progress update fails
            }
        }

        return { submission, section };
    }

    async findBySection(section: string): Promise<HomeworkSection[]> {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: 'submission'
                }
            ]
        });
    }

    async findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSection[]> {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: 'submission',
                    where: { student_id: studentId }
                }
            ]
        });
    }

    async findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSection[]> {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: 'submission',
                    where: { homework_id: homeworkId }
                }
            ]
        });
    }

    async findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSection> {
        const homeworkSection = await this.homeworkSectionModel.findOne({
            where: { section },
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: 'submission',
                    where: {
                        student_id: studentId,
                        homework_id: homeworkId
                    }
                }
            ]
        });
        
        if (!homeworkSection) {
            throw new NotFoundException(`Homework section not found for student ${studentId}, homework ${homeworkId}, and section ${section}`);
        }
        
        return homeworkSection;
    }

    async remove(id: string): Promise<void> {
        const submission = await this.findOne(id);
        await submission.destroy();
    }
}
