import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
            },
            attributes: ['id', 'homework_id', 'student_id', 'lesson_id', 'createdAt', 'updatedAt'] // Explicitly specify the columns to select
        });

        if (!submission) {
            // Create new submission
            submission = await this.homeworkSubmissionModel.create({
                homework_id: createHomeworkSubmissionDto.homework_id,
                student_id: createHomeworkSubmissionDto.student_id,
                lesson_id: createHomeworkSubmissionDto.lesson_id,
            });
        }

        // Check if a section already exists for this submission, section type AND exercise_id
        let section = null;
        
        if (createHomeworkSubmissionDto.exercise_id) {
            // If exercise_id is provided, look for a section with this specific exercise_id
            section = await this.homeworkSectionModel.findOne({
                where: {
                    submission_id: submission.id,
                    section: createHomeworkSubmissionDto.section,
                    exercise_id: createHomeworkSubmissionDto.exercise_id
                }
            });
        }

        if (section) {
            // Update existing section with the same exercise_id
            await section.update({
                score: createHomeworkSubmissionDto.percentage,
                answers: createHomeworkSubmissionDto.answers || {}
            });
        } else {
            // Create new section (either because no section exists for this exercise_id or exercise_id is not provided)
            section = await this.homeworkSectionModel.create({
                submission_id: submission.id,
                exercise_id: createHomeworkSubmissionDto.exercise_id,
                score: createHomeworkSubmissionDto.percentage,
                section: createHomeworkSubmissionDto.section,
                answers: createHomeworkSubmissionDto.answers || {}
            });
        }

        // Only proceed if we have a passing score, a student ID, lesson ID and homework ID
        if (section.score && section.score >= 60 && submission.student_id && submission.lesson_id && submission.homework_id) {
            try {
                // Step 1: Update the specific section progress first
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(
                    submission.student_id,
                    submission.homework_id,
                    section.section
                );
                
                // Step 2: Check if all sections for this lesson have been completed
                await this.checkAndUpdateAllSectionsCompleted(submission);
            } catch (error) {
                console.warn('Failed to update lesson progress:', error);
                // Don't fail the homework submission if lesson progress update fails
            }
        }

        return { submission, section };
    }
    
    /**
     * Check if all required exercises and speaking sections for a lesson have been submitted
     * and update the lesson progress accordingly
     */
    private async checkAndUpdateAllSectionsCompleted(submission: HomeworkSubmission): Promise<void> {
        if (!submission.lesson_id || !submission.student_id) {
            return;
        }

        try {
            // First get all submissions for this student and lesson
            const submissions = await this.homeworkSubmissionModel.findAll({
                where: {
                    student_id: submission.student_id,
                    lesson_id: submission.lesson_id
                },
                attributes: ['id', 'student_id', 'lesson_id', 'homework_id']
            });

            // Get all submission IDs
            const submissionIds = submissions.map(sub => sub.id);

            // Now get sections for these submissions
            const sections = await this.homeworkSectionModel.findAll({
                where: {
                    submission_id: { [Op.in]: submissionIds },
                    score: { [Op.gte]: 60 } // Only count sections with passing scores
                }
            });

            // Group completed sections by type
            const completedSectionTypes = new Set(sections.map(s => s.section));
            
            // Get the current lesson progress
            const progress = await this.lessonProgressService.findByStudentAndLesson(
                submission.student_id,
                submission.lesson_id
            );
            
            if (!progress) {
                return;
            }
            
            // Update each section based on submissions
            const sectionTypes = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
            const updateData: any = {};
            
            for (const section of sectionTypes) {
                if (completedSectionTypes.has(section)) {
                    const sectionField = `${section}_completed` as keyof typeof updateData;
                    updateData[sectionField] = true;
                }
            }
            
            // Update the progress with all completed sections
            await progress.update(updateData);
            
            // Recalculate the overall progress
            await this.lessonProgressService.recalculateProgress(progress);
            
            console.log(`Updated lesson progress for student ${submission.student_id}, lesson ${submission.lesson_id}`);
        } catch (error) {
            console.error('Error checking all sections completed:', error);
        }
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
