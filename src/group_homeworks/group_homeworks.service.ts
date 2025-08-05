import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupHomeworkDto } from './dto/create-group-homework.dto.js';
import { UpdateGroupHomeworkDto } from './dto/update-group_homework.dto.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';
import { Exercise } from '../exercise/entities/exercise.entity.js';
import { Speaking } from '../speaking/entities/speaking.entity.js';
import { LessonContent } from '../lesson-content/entities/lesson-content.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';

import { Op } from 'sequelize';

@Injectable()
export class GroupHomeworksService {
    constructor(
        @InjectModel(GroupHomework)
        private groupHomeworkModel: typeof GroupHomework,
        @InjectModel(GroupStudent)
        private groupStudentModel: typeof GroupStudent,
        @InjectModel(Lesson)
        private lessonModel: typeof Lesson,
        @InjectModel(Exercise)
        private exerciseModel: typeof Exercise,
        @InjectModel(Speaking)
        private speakingModel: typeof Speaking,
        @InjectModel(LessonContent)
        private lessonContentModel: typeof LessonContent,
        @InjectModel(LessonVocabularySet)
        private lessonVocabularySetModel: typeof LessonVocabularySet
    ) {}

    async create(createDto: CreateGroupHomeworkDto): Promise<GroupHomework> {
        return await this.groupHomeworkModel.create({
            ...createDto
        });
    }

    async findAll(): Promise<GroupHomework[]> {
        return await this.groupHomeworkModel.findAll({
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.exerciseModel,
                            as: 'exercises'
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking'
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary'
                        }
                    ]
                }
            ]
        });
    }

    async findOne(id: string): Promise<GroupHomework> {
        const homework = await this.groupHomeworkModel.findOne({
            where: { id },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises'
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking'
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary'
                        }
                    ]
                }
            ]
        });

        if (!homework) {
            throw new NotFoundException(`Group homework with ID ${id} not found`);
        }

        return homework;
    }

    async findByGroupId(groupId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworkModel.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises'
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking'
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary'
                        }
                    ]
                }
            ]
        });
    }

    async findByTeacherId(teacherId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworkModel.findAll({
            where: { teacher_id: teacherId },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises'
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking'
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary'
                        }
                    ]
                }
            ]
        });
    }

    async findByLessonId(lessonId: string): Promise<GroupHomework[]> {
        return await this.groupHomeworkModel.findAll({
            where: { lesson_id: lessonId },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises'
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking'
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary'
                        }
                    ]
                }
            ]
        });
    }

    async update(id: string, updateDto: UpdateGroupHomeworkDto): Promise<GroupHomework> {
        const [affectedCount] = await this.groupHomeworkModel.update(
            updateDto,
            {
                where: { id }
            }
        );

        if (affectedCount === 0) {
            throw new NotFoundException(`Group homework with ID ${id} not found`);
        }

        return await this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.groupHomeworkModel.destroy({
            where: { id }
        });

        if (result === 0) {
            throw new NotFoundException(`Group homework with ID ${id} not found`);
        }
    }

    async getHomeworksForUser(userId: string): Promise<GroupHomework[]> {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { student_id: userId },
        });

        if (!groupStudent) {
            throw new NotFoundException('User is not in any group');
        }

        return this.groupHomeworkModel.findAll({
            where: { group_id: groupStudent.group_id },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                            {
                                model: this.lessonContentModel,
                                as: 'theory'
                            },
                            {
                                model: this.exerciseModel,
                                as: 'exercises',
                                attributes: ['id','exercise_type', 'lesson_id']
                            },
                            {
                                model: this.speakingModel,
                                as: 'speaking',
                                attributes: ['id', 'lesson_id',]
                            },
                            {
                                model: this.lessonVocabularySetModel,
                                as: 'lesson_vocabulary',
                                attributes: ['id', 'lesson_id']
                            }
                        ]
                }
            ]
        });
    }

    async getActiveHomeworksByDate(userId: string, date?: Date): Promise<GroupHomework[]> {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { student_id: userId },
        });

        if (!groupStudent) {
            throw new NotFoundException('User is not in any group');
        }

        // If no date is provided, use current date
        const currentDate = date ? date : new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        return this.groupHomeworkModel.findAll({
            where: {
                group_id: groupStudent.group_id,
                // Active homework has start_date before or equal to current date
                // and deadline after or equal to current date
                start_date: {
                    [Op.lte]: formattedDate, // less than or equal to current date
                },
                deadline: {
                    [Op.gte]: formattedDate, // greater than or equal to current date
                },
            },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises',
                            attributes: ['id','exercise_type', 'lesson_id']
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking',
                            attributes: ['id', 'lessonId',]
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary',
                            attributes: ['id', 'lesson_id']
                        }
                    ]
                }
            ]
        });
    }

    /**
     * Get homework with detailed lesson content including exercises and speaking activities
     * @param homeworkId The ID of the homework to fetch
     * @returns The homework with all related lesson content
     */
    async getHomeworkWithLessonContent(homeworkId: string): Promise<GroupHomework> {
        const homework = await this.groupHomeworkModel.findOne({
            where: { id: homeworkId },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    include: [
                        {
                            model: this.lessonContentModel,
                            as: 'theory'
                        },
                        {
                            model: this.exerciseModel,
                            as: 'exercises',
                            attributes: ['id','exercise_type', 'lesson_id']
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking',
                            attributes: ['id', 'lesson_id',]
                        },
                        {
                            model: this.lessonVocabularySetModel,
                            as: 'lesson_vocabulary',
                            attributes: ['id', 'lesson_id']
                        }
                    ]
                }
            ]
        });

        if (!homework) {
            throw new NotFoundException(`Group homework with ID ${homeworkId} not found`);
        }

        return homework;
    }
}
