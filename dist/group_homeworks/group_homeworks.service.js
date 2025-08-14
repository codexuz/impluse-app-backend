var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupHomework } from './entities/group_homework.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { Lesson } from '../lesson/entities/lesson.entity.js';
import { Exercise } from '../exercise/entities/exercise.entity.js';
import { Speaking } from '../speaking/entities/speaking.entity.js';
import { LessonContent } from '../lesson-content/entities/lesson-content.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
import { Op } from 'sequelize';
let GroupHomeworksService = class GroupHomeworksService {
    constructor(groupHomeworkModel, groupStudentModel, lessonModel, exerciseModel, speakingModel, lessonContentModel, lessonVocabularySetModel, homeworkSubmissionModel) {
        this.groupHomeworkModel = groupHomeworkModel;
        this.groupStudentModel = groupStudentModel;
        this.lessonModel = lessonModel;
        this.exerciseModel = exerciseModel;
        this.speakingModel = speakingModel;
        this.lessonContentModel = lessonContentModel;
        this.lessonVocabularySetModel = lessonVocabularySetModel;
        this.homeworkSubmissionModel = homeworkSubmissionModel;
    }
    async create(createDto) {
        return await this.groupHomeworkModel.create({
            ...createDto
        });
    }
    async findAll() {
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
    async findOne(id) {
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
    async findByGroupId(groupId) {
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
    async findByTeacherId(teacherId) {
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
    async findByLessonId(lessonId) {
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
    async update(id, updateDto) {
        const [affectedCount] = await this.groupHomeworkModel.update(updateDto, {
            where: { id }
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Group homework with ID ${id} not found`);
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.groupHomeworkModel.destroy({
            where: { id }
        });
        if (result === 0) {
            throw new NotFoundException(`Group homework with ID ${id} not found`);
        }
    }
    async getHomeworksForUser(userId) {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { student_id: userId },
        });
        if (!groupStudent) {
            throw new NotFoundException('User is not in any group');
        }
        const homeworks = await this.groupHomeworkModel.findAll({
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
                            attributes: ['id', 'exercise_type', 'lessonId']
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
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: userId,
                homework_id: { [Op.in]: homeworks.map(h => h.id) }
            }
        });
        const submissionMap = new Map();
        submissions.forEach(submission => {
            const key = `${submission.homework_id}_${submission.section}`;
            submissionMap.set(key, submission);
        });
        const homeworksWithStatus = homeworks.map(homework => {
            const homeworkData = homework.toJSON();
            if (homeworkData.lesson && homeworkData.lesson.exercises) {
                homeworkData.lesson.exercises = homeworkData.lesson.exercises.map(exercise => {
                    const exerciseType = exercise.exercise_type.toLowerCase();
                    const submissionKey = `${homework.id}_${exerciseType}`;
                    const submission = submissionMap.get(submissionKey);
                    return {
                        ...exercise,
                        status: submission ? (submission.status === 'passed' || submission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                        submission: submission || null
                    };
                });
            }
            if (homeworkData.lesson && homeworkData.lesson.speaking) {
                const speakingSubmissionKey = `${homework.id}_speaking`;
                const speakingSubmission = submissionMap.get(speakingSubmissionKey);
                homeworkData.lesson.speaking = {
                    ...homeworkData.lesson.speaking,
                    status: speakingSubmission ? (speakingSubmission.status === 'passed' || speakingSubmission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                    submission: speakingSubmission || null
                };
            }
            if (homeworkData.lesson && homeworkData.lesson.lesson_vocabulary) {
                homeworkData.lesson.lesson_vocabulary = homeworkData.lesson.lesson_vocabulary.map(vocab => {
                    const vocabSubmissionKey = `${homework.id}_vocabulary`;
                    const vocabSubmission = submissionMap.get(vocabSubmissionKey);
                    return {
                        ...vocab,
                        status: vocabSubmission ? (vocabSubmission.status === 'passed' || vocabSubmission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                        submission: vocabSubmission || null
                    };
                });
            }
            const homeworkSubmissions = submissions.filter(sub => sub.homework_id === homework.id);
            const isHomeworkFinished = homeworkSubmissions.some(sub => sub.status === 'passed' || sub.status === 'failed');
            return {
                ...homeworkData,
                homeworkStatus: isHomeworkFinished ? 'finished' : 'unfinished',
                submissionCount: homeworkSubmissions.length,
                isOverdue: homework.deadline && new Date(homework.deadline) < new Date()
            };
        });
        return homeworksWithStatus;
    }
    async getActiveHomeworksByDate(userId, date) {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { student_id: userId },
        });
        if (!groupStudent) {
            throw new NotFoundException('User is not in any group');
        }
        const currentDate = date ? date : new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const homeworks = await this.groupHomeworkModel.findAll({
            where: {
                group_id: groupStudent.group_id,
                start_date: {
                    [Op.lte]: formattedDate,
                },
                deadline: {
                    [Op.gte]: formattedDate,
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
                            attributes: ['id', 'exercise_type', 'lessonId']
                        },
                        {
                            model: this.speakingModel,
                            as: 'speaking',
                            attributes: ['id', 'lessonId']
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
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: userId,
                homework_id: { [Op.in]: homeworks.map(h => h.id) }
            }
        });
        const submissionMap = new Map();
        submissions.forEach(submission => {
            const key = `${submission.homework_id}_${submission.section}`;
            submissionMap.set(key, submission);
        });
        const homeworksWithStatus = homeworks.map(homework => {
            const homeworkData = homework.toJSON();
            if (homeworkData.lesson && homeworkData.lesson.exercises) {
                homeworkData.lesson.exercises = homeworkData.lesson.exercises.map(exercise => {
                    const exerciseType = exercise.exercise_type.toLowerCase();
                    const submissionKey = `${homework.id}_${exerciseType}`;
                    const submission = submissionMap.get(submissionKey);
                    return {
                        ...exercise,
                        status: submission ? (submission.status === 'passed' || submission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                        submission: submission || null
                    };
                });
            }
            if (homeworkData.lesson && homeworkData.lesson.speaking) {
                const speakingSubmissionKey = `${homework.id}_speaking`;
                const speakingSubmission = submissionMap.get(speakingSubmissionKey);
                homeworkData.lesson.speaking = {
                    ...homeworkData.lesson.speaking,
                    status: speakingSubmission ? (speakingSubmission.status === 'passed' || speakingSubmission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                    submission: speakingSubmission || null
                };
            }
            if (homeworkData.lesson && homeworkData.lesson.lesson_vocabulary) {
                homeworkData.lesson.lesson_vocabulary = homeworkData.lesson.lesson_vocabulary.map(vocab => {
                    const vocabSubmissionKey = `${homework.id}_vocabulary`;
                    const vocabSubmission = submissionMap.get(vocabSubmissionKey);
                    return {
                        ...vocab,
                        status: vocabSubmission ? (vocabSubmission.status === 'passed' || vocabSubmission.status === 'failed' ? 'finished' : 'unfinished') : 'unfinished',
                        submission: vocabSubmission || null
                    };
                });
            }
            const homeworkSubmissions = submissions.filter(sub => sub.homework_id === homework.id);
            const isHomeworkFinished = homeworkSubmissions.some(sub => sub.status === 'passed' || sub.status === 'failed');
            return {
                ...homeworkData,
                homeworkStatus: isHomeworkFinished ? 'finished' : 'unfinished',
                submissionCount: homeworkSubmissions.length,
                isOverdue: homework.deadline && new Date(homework.deadline) < new Date(),
                isActive: true
            };
        });
        return homeworksWithStatus;
    }
    async getHomeworkWithLessonContent(homeworkId) {
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
                            attributes: ['id', 'exercise_type', 'lessonId']
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
        if (!homework) {
            throw new NotFoundException(`Group homework with ID ${homeworkId} not found`);
        }
        return homework;
    }
    async getHomeworkStatusByStudent(studentId, groupId) {
        const groupWhere = {};
        if (groupId) {
            groupWhere.group_id = groupId;
        }
        else {
            const studentGroups = await this.groupStudentModel.findAll({
                where: { student_id: studentId },
                attributes: ['group_id']
            });
            const groupIds = studentGroups.map(sg => sg.group_id);
            groupWhere.group_id = { [Op.in]: groupIds };
        }
        const homeworks = await this.groupHomeworkModel.findAll({
            where: groupWhere,
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    attributes: ['id', 'title']
                }
            ],
            order: [['deadline', 'ASC']]
        });
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: studentId,
                homework_id: { [Op.in]: homeworks.map(h => h.id) }
            }
        });
        const submissionMap = new Map();
        submissions.forEach(submission => {
            const key = submission.homework_id;
            if (!submissionMap.has(key)) {
                submissionMap.set(key, []);
            }
            submissionMap.get(key).push(submission);
        });
        const finishedHomeworks = [];
        const unfinishedHomeworks = [];
        homeworks.forEach(homework => {
            const homeworkSubmissions = submissionMap.get(homework.id) || [];
            const isFinished = homeworkSubmissions.some(sub => sub.status === 'passed' || sub.status === 'failed');
            const homeworkData = {
                ...homework.toJSON(),
                submissions: homeworkSubmissions,
                submissionCount: homeworkSubmissions.length,
                isOverdue: homework.deadline && new Date(homework.deadline) < new Date()
            };
            if (isFinished) {
                finishedHomeworks.push(homeworkData);
            }
            else {
                unfinishedHomeworks.push(homeworkData);
            }
        });
        return {
            studentId,
            groupId,
            summary: {
                total: homeworks.length,
                finished: finishedHomeworks.length,
                unfinished: unfinishedHomeworks.length,
                overdue: unfinishedHomeworks.filter(h => h.isOverdue).length
            },
            finishedHomeworks,
            unfinishedHomeworks
        };
    }
    async getHomeworkStatusByGroup(groupId) {
        const groupStudents = await this.groupStudentModel.findAll({
            where: { group_id: groupId },
            attributes: ['student_id']
        });
        const studentIds = groupStudents.map(gs => gs.student_id);
        const homeworks = await this.groupHomeworkModel.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: this.lessonModel,
                    as: 'lesson',
                    attributes: ['id', 'title']
                }
            ],
            order: [['deadline', 'ASC']]
        });
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                homework_id: { [Op.in]: homeworks.map(h => h.id) },
                student_id: { [Op.in]: studentIds }
            }
        });
        const submissionMap = new Map();
        submissions.forEach(submission => {
            const key = `${submission.homework_id}_${submission.student_id}`;
            if (!submissionMap.has(key)) {
                submissionMap.set(key, []);
            }
            submissionMap.get(key).push(submission);
        });
        const homeworksWithStatus = homeworks.map(homework => {
            const studentSubmissions = [];
            let finishedCount = 0;
            let unfinishedCount = 0;
            studentIds.forEach(studentId => {
                const key = `${homework.id}_${studentId}`;
                const studentSubmissionsList = submissionMap.get(key) || [];
                const isFinished = studentSubmissionsList.some(sub => sub.status === 'passed' || sub.status === 'failed');
                studentSubmissions.push({
                    studentId,
                    submissions: studentSubmissionsList,
                    isFinished,
                    submissionCount: studentSubmissionsList.length
                });
                if (isFinished) {
                    finishedCount++;
                }
                else {
                    unfinishedCount++;
                }
            });
            return {
                ...homework.toJSON(),
                studentSubmissions,
                summary: {
                    totalStudents: studentIds.length,
                    finished: finishedCount,
                    unfinished: unfinishedCount,
                    completionRate: studentIds.length > 0 ? ((finishedCount / studentIds.length) * 100).toFixed(2) : '0.00'
                },
                isOverdue: homework.deadline && new Date(homework.deadline) < new Date()
            };
        });
        return {
            groupId,
            studentCount: studentIds.length,
            summary: {
                totalHomeworks: homeworks.length,
                overdueHomeworks: homeworksWithStatus.filter(h => h.isOverdue).length
            },
            homeworks: homeworksWithStatus
        };
    }
    async getOverallHomeworkStats(groupId) {
        const whereClause = {};
        if (groupId) {
            whereClause.group_id = groupId;
        }
        const totalHomeworks = await this.groupHomeworkModel.count({ where: whereClause });
        const overdueHomeworks = await this.groupHomeworkModel.count({
            where: {
                ...whereClause,
                deadline: { [Op.lt]: new Date() }
            }
        });
        const upcomingHomeworks = await this.groupHomeworkModel.count({
            where: {
                ...whereClause,
                deadline: { [Op.gt]: new Date() }
            }
        });
        return {
            groupId,
            totalHomeworks,
            overdueHomeworks,
            upcomingHomeworks,
            noDeadlineHomeworks: totalHomeworks - overdueHomeworks - upcomingHomeworks
        };
    }
};
GroupHomeworksService = __decorate([
    Injectable(),
    __param(0, InjectModel(GroupHomework)),
    __param(1, InjectModel(GroupStudent)),
    __param(2, InjectModel(Lesson)),
    __param(3, InjectModel(Exercise)),
    __param(4, InjectModel(Speaking)),
    __param(5, InjectModel(LessonContent)),
    __param(6, InjectModel(LessonVocabularySet)),
    __param(7, InjectModel(HomeworkSubmission)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], GroupHomeworksService);
export { GroupHomeworksService };
//# sourceMappingURL=group_homeworks.service.js.map