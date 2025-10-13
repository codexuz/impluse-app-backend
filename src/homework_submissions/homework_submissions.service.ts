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
            speaking_id: createHomeworkSubmissionDto.speaking_id,
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
                speaking_id: createHomeworkSubmissionDto.speaking_id,
                answers: createHomeworkSubmissionDto.answers || {}
            });
        } else {
            // Create new section (either because no section exists for this exercise_id or exercise_id is not provided)
            section = await this.homeworkSectionModel.create({
                submission_id: submission.id,
                exercise_id: createHomeworkSubmissionDto.exercise_id,
                speaking_id: createHomeworkSubmissionDto.speaking_id,
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

    /**
     * Get exercises with their scores from homework sections by student_id and homework_id
     * @param studentId The student's ID
     * @param homeworkId The homework's ID
     * @param section Optional section type to filter by (reading, listening, grammar, writing, speaking)
     * @returns Array of exercises with scores and completion status
     */
    async getExercisesWithScoresByStudentAndHomework(
        studentId: string, 
        homeworkId: string, 
        section?: string
    ): Promise<any[]> {
        // Find the submission for this student and homework
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId
            },
            attributes: ['id']
        });

        if (!submission) {
            return []; // Return empty array if no submission exists
        }

        // Prepare where clause for sections
        const whereClause: any = {
            submission_id: submission.id
        };
        
        // Add section filter if provided
        if (section) {
            whereClause.section = section;
        }

        // Get all sections with their associated exercises
        const sections = await this.homeworkSectionModel.findAll({
            where: whereClause,
            include: [
                {
                    model: this.homeworkSubmissionModel.sequelize.models.Exercise,
                    as: 'exercise',
                    attributes: [
                        'id',
                        'title',
                        'exercise_type',
                        'lesson_id'
                    ]
                }
            ],
            attributes: [
                'id',
                'exercise_id',
                'score',
                'section',
                'answers'
            ]
        });

        // Transform the data to include the completed status
        return sections.map(section => {
            const data = section.toJSON();
            
            // Add a completed status based on the score
            const isCompleted = section.score >= 60;
            
            return {
                ...data,
                completed: isCompleted,
                exercise: data.exercise ? {
                    ...data.exercise,
                    completed: isCompleted, // Adding completion status to exercise object too
                    score: section.score
                } : null
            };
        });
    }

    /**
     * Get student's homework statistics average by section type over time
     * @param studentId The student's ID
     * @param startDate Optional start date to filter statistics (format: YYYY-MM-DD)
     * @param endDate Optional end date to filter statistics (format: YYYY-MM-DD)
     * @returns Object with section types as keys and average scores as values
     * @description If startDate and endDate are not provided, defaults to the last month of data
     */
    async getStudentHomeworkStatsBySection(
        studentId: string, 
        startDate?: string, 
        endDate?: string
    ): Promise<{ 
        overall: number;
        sections: { 
            [key: string]: { 
                average: number; 
                submissions: number;
                trend: number[];
            } 
        } 
    }> {
        // Find all submissions for this student
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: studentId
            },
            attributes: ['id'],
            order: [['createdAt', 'ASC']]
        });

        if (!submissions || submissions.length === 0) {
            return { 
                overall: 0,
                sections: {} 
            };
        }

        const submissionIds = submissions.map(sub => sub.id);
        
        // Prepare date filter with default one-month interval if not provided
        const dateFilter = {};
        
        // If neither startDate nor endDate is provided, set default one-month interval
        if (!startDate && !endDate) {
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            dateFilter['createdAt'] = {
                [Op.gte]: oneMonthAgo,
                [Op.lte]: today
            };
        } else {
            // Handle provided dates
            if (startDate) {
                dateFilter['createdAt'] = {
                    [Op.gte]: new Date(startDate)
                };
            }
            if (endDate) {
                dateFilter['createdAt'] = {
                    ...dateFilter['createdAt'],
                    [Op.lte]: new Date(endDate)
                };
            }
        }
        
        // Get all sections for these submissions
        const sections = await this.homeworkSectionModel.findAll({
            where: {
                submission_id: { [Op.in]: submissionIds },
                ...dateFilter
            },
            order: [['createdAt', 'ASC']],
            attributes: ['section', 'score', 'createdAt']
        });
        
        // Initialize the result structure with section types
        const sectionTypes = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        const result = {
            overall: 0,
            sections: {}
        };
        
        sectionTypes.forEach(sectionType => {
            result.sections[sectionType] = {
                average: 0,
                submissions: 0,
                trend: []
            };
        });
        
        // Process each section to calculate averages and collect trend data
        let totalScore = 0;
        let totalSubmissions = 0;
        
        sections.forEach(section => {
            if (section.section && sectionTypes.includes(section.section)) {
                // Only include valid sections and scores
                if (section.score !== null && section.score !== undefined) {
                    // Add to specific section stats
                    result.sections[section.section].submissions += 1;
                    result.sections[section.section].average += section.score;
                    result.sections[section.section].trend.push(section.score);
                    
                    // Add to overall stats
                    totalScore += section.score;
                    totalSubmissions += 1;
                }
            }
        });
        
        // Calculate the averages
        if (totalSubmissions > 0) {
            result.overall = parseFloat((totalScore / totalSubmissions).toFixed(2));
            
            // Calculate averages for each section
            sectionTypes.forEach(sectionType => {
                if (result.sections[sectionType].submissions > 0) {
                    result.sections[sectionType].average = parseFloat(
                        (result.sections[sectionType].average / result.sections[sectionType].submissions).toFixed(2)
                    );
                }
            });
        }
        
        return result;
    }

    /**
     * Get homework sections by speaking_id with their answers and score
     * @param speakingId The speaking exercise ID
     * @param studentId Optional student ID to filter submissions by student
     * @returns Array of homework sections with answers related to the speaking exercise
     */
    async getHomeworkSectionsBySpeakingId(speakingId: string, studentId?: string): Promise<any[]> {
        // Prepare query conditions
        const whereClause: any = {
            speaking_id: speakingId
        };

        const includeOptions: any = [
            {
                model: this.homeworkSubmissionModel,
                as: 'submission',
                attributes: ['id', 'student_id', 'homework_id', 'lesson_id', 'createdAt']
            }
        ];

        // Add student filter if provided
        if (studentId) {
            includeOptions[0].where = { student_id: studentId };
        }

        // Get all sections for this speaking exercise
        const sections = await this.homeworkSectionModel.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['createdAt', 'DESC']],
            attributes: [
                'id',
                'score',
                'section',
                'answers',
                'speaking_id',
                'createdAt',
                'updatedAt'
            ]
        });

        // Transform the data to include completion status
        return sections.map(section => {
            const data = section.toJSON();
            
            // Add a completed status based on the score
            const isCompleted = section.score >= 60;
            
            return {
                ...data,
                completed: isCompleted
            };
        });
    }
}
