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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QuestionType } from './dto/create-complete-exercise.dto.js';
import { Exercise } from './entities/exercise.entity.js';
import { Questions } from './entities/questions.js';
import { Choices } from './entities/choices.js';
import { GapFilling } from './entities/gap_filling.js';
import { MatchingExercise } from './entities/matching_pairs.js';
import { TypingExercise } from './entities/typing_answers.js';
import { Sequelize } from 'sequelize-typescript';
let ExerciseService = class ExerciseService {
    constructor(exerciseModel, questionsModel, choicesModel, gapFillingModel, matchingExerciseModel, typingExerciseModel, sequelize) {
        this.exerciseModel = exerciseModel;
        this.questionsModel = questionsModel;
        this.choicesModel = choicesModel;
        this.gapFillingModel = gapFillingModel;
        this.matchingExerciseModel = matchingExerciseModel;
        this.typingExerciseModel = typingExerciseModel;
        this.sequelize = sequelize;
    }
    async create(createExerciseDto) {
        const transaction = await this.sequelize.transaction();
        try {
            const exercise = await this.exerciseModel.create({
                title: createExerciseDto.title,
                exercise_type: createExerciseDto.exercise_type,
                audio_url: createExerciseDto.audio_url,
                image_url: createExerciseDto.image_url,
                instructions: createExerciseDto.instructions,
                content: createExerciseDto.content,
                isActive: createExerciseDto.isActive ?? true,
                lessonId: createExerciseDto.lessonId,
            }, { transaction });
            if (createExerciseDto.questions && createExerciseDto.questions.length > 0) {
                for (const questionData of createExerciseDto.questions) {
                    const question = await this.questionsModel.create({
                        exercise_id: exercise.id,
                        question_type: questionData.question_type,
                        question_text: questionData.question_text,
                        points: questionData.points,
                        order_number: questionData.order_number,
                        sample_answer: questionData.sample_answer,
                    }, { transaction });
                    switch (questionData.question_type) {
                        case QuestionType.MULTIPLE_CHOICE:
                            if (questionData.choices && questionData.choices.length > 0) {
                                await this.createChoices(question.id, questionData.choices, transaction);
                            }
                            break;
                        case QuestionType.FILL_IN_THE_BLANK:
                            if (questionData.gap_filling && questionData.gap_filling.length > 0) {
                                await this.createGapFilling(question.id, questionData.gap_filling, transaction);
                            }
                            break;
                        case QuestionType.MATCHING:
                            if (questionData.matching_pairs && questionData.matching_pairs.length > 0) {
                                await this.createMatchingPairs(question.id, questionData.matching_pairs, transaction);
                            }
                            break;
                        case QuestionType.SHORT_ANSWER:
                            if (questionData.typing_exercise) {
                                await this.createTypingExercise(question.id, questionData.typing_exercise, transaction);
                            }
                            break;
                        case QuestionType.TRUE_FALSE:
                            if (questionData.choices && questionData.choices.length > 0) {
                                await this.createChoices(question.id, questionData.choices, transaction);
                            }
                            break;
                    }
                }
            }
            await transaction.commit();
            return this.findOne(exercise.id);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async findAll() {
        return await this.exerciseModel.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']],
            include: this.getIncludeOptions()
        });
    }
    async findOne(id) {
        const exercise = await this.exerciseModel.findOne({
            where: { id, isActive: true },
            include: this.getIncludeOptions()
        });
        if (!exercise) {
            throw new NotFoundException(`Exercise with ID ${id} not found`);
        }
        return exercise;
    }
    async findByLessonId(lessonId) {
        return await this.exerciseModel.findAll({
            where: { lessonId, isActive: true },
            order: [['createdAt', 'ASC']],
            include: this.getIncludeOptions()
        });
    }
    async findByType(exerciseType) {
        return await this.exerciseModel.findAll({
            where: { exercise_type: exerciseType, isActive: true },
            order: [['createdAt', 'DESC']],
            include: this.getIncludeOptions()
        });
    }
    async findByTypeAndLessonId(exerciseType, lessonId) {
        return await this.exerciseModel.findAll({
            where: {
                exercise_type: exerciseType,
                lessonId: lessonId,
                isActive: true
            },
            order: [['createdAt', 'ASC']],
            include: this.getIncludeOptions()
        });
    }
    async getQuestionsForExercise(exerciseId) {
        const exercise = await this.exerciseModel.findOne({
            where: { id: exerciseId, isActive: true }
        });
        if (!exercise) {
            throw new NotFoundException(`Exercise with ID ${exerciseId} not found`);
        }
        return await this.questionsModel.findAll({
            where: { exercise_id: exerciseId },
            order: [['order_number', 'ASC']],
            include: [
                {
                    model: this.choicesModel,
                    as: 'options',
                    required: false
                },
                {
                    model: this.gapFillingModel,
                    as: 'gap_filling',
                    required: false
                },
                {
                    model: this.matchingExerciseModel,
                    as: 'matching',
                    required: false
                },
                {
                    model: this.typingExerciseModel,
                    as: 'typing',
                    required: false
                }
            ]
        });
    }
    async update(id, updateExerciseDto) {
        const transaction = await this.sequelize.transaction();
        try {
            const exercise = await this.exerciseModel.findOne({
                where: { id, isActive: true },
                transaction
            });
            if (!exercise) {
                throw new NotFoundException(`Exercise with ID ${id} not found`);
            }
            await exercise.update({
                title: updateExerciseDto.title,
                exercise_type: updateExerciseDto.exercise_type,
                audio_url: updateExerciseDto.audio_url,
                image_url: updateExerciseDto.image_url,
                instructions: updateExerciseDto.instructions,
                content: updateExerciseDto.content,
                isActive: updateExerciseDto.isActive,
                lessonId: updateExerciseDto.lessonId,
            }, { transaction });
            if (updateExerciseDto.questions) {
                await this.deleteExistingQuestions(id, transaction);
                for (const questionData of updateExerciseDto.questions) {
                    const question = await this.questionsModel.create({
                        exercise_id: exercise.id,
                        question_type: questionData.question_type,
                        question_text: questionData.question_text,
                        points: questionData.points,
                        order_number: questionData.order_number,
                        sample_answer: questionData.sample_answer,
                    }, { transaction });
                    switch (questionData.question_type) {
                        case QuestionType.MULTIPLE_CHOICE:
                            if (questionData.choices && questionData.choices.length > 0) {
                                await this.createChoices(question.id, questionData.choices, transaction);
                            }
                            break;
                        case QuestionType.FILL_IN_THE_BLANK:
                            if (questionData.gap_filling && questionData.gap_filling.length > 0) {
                                await this.createGapFilling(question.id, questionData.gap_filling, transaction);
                            }
                            break;
                        case QuestionType.MATCHING:
                            if (questionData.matching_pairs && questionData.matching_pairs.length > 0) {
                                await this.createMatchingPairs(question.id, questionData.matching_pairs, transaction);
                            }
                            break;
                        case QuestionType.SHORT_ANSWER:
                            if (questionData.typing_exercise) {
                                await this.createTypingExercise(question.id, questionData.typing_exercise, transaction);
                            }
                            break;
                        case QuestionType.TRUE_FALSE:
                            if (questionData.choices && questionData.choices.length > 0) {
                                await this.createChoices(question.id, questionData.choices, transaction);
                            }
                            break;
                    }
                }
            }
            await transaction.commit();
            return this.findOne(id);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async remove(id) {
        const exercise = await this.exerciseModel.findOne({
            where: { id, isActive: true }
        });
        if (!exercise) {
            throw new NotFoundException(`Exercise with ID ${id} not found`);
        }
        await exercise.update({ isActive: false });
    }
    getIncludeOptions() {
        return [
            {
                model: this.questionsModel,
                as: 'questions',
                required: false,
                include: [
                    {
                        model: this.choicesModel,
                        as: 'choices',
                        required: false
                    },
                    {
                        model: this.gapFillingModel,
                        as: 'gap_filling',
                        required: false
                    },
                    {
                        model: this.matchingExerciseModel,
                        as: 'matching_pairs',
                        required: false
                    },
                    {
                        model: this.typingExerciseModel,
                        as: 'typing_exercise',
                        required: false
                    },
                ]
            }
        ];
    }
    async deleteExistingQuestions(exerciseId, transaction) {
        const questions = await this.questionsModel.findAll({
            where: { exercise_id: exerciseId },
            transaction
        });
        for (const question of questions) {
            await this.choicesModel.destroy({
                where: { question_id: question.id },
                transaction
            });
            await this.gapFillingModel.destroy({
                where: { question_id: question.id },
                transaction
            });
            await this.matchingExerciseModel.destroy({
                where: { question_id: question.id },
                transaction
            });
            await this.typingExerciseModel.destroy({
                where: { question_id: question.id },
                transaction
            });
        }
        await this.questionsModel.destroy({
            where: { exercise_id: exerciseId },
            transaction
        });
    }
    async createChoices(questionId, choices, transaction) {
        const choicesData = choices.map(choice => ({
            question_id: questionId,
            option_text: choice.option_text,
            is_correct: choice.is_correct
        }));
        await this.choicesModel.bulkCreate(choicesData, { transaction });
    }
    async createGapFilling(questionId, gapFillingData, transaction) {
        const gapData = gapFillingData.map(gap => ({
            question_id: questionId,
            gap_number: gap.gap_number,
            correct_answer: gap.correct_answer
        }));
        await this.gapFillingModel.bulkCreate(gapData, { transaction });
    }
    async createMatchingPairs(questionId, pairs, transaction) {
        const pairsData = pairs.map(pair => ({
            question_id: questionId,
            left_item: pair.left_item,
            right_item: pair.right_item
        }));
        await this.matchingExerciseModel.bulkCreate(pairsData, { transaction });
    }
    async createTypingExercise(questionId, typingData, transaction) {
        const items = Array.isArray(typingData) ? typingData : [typingData];
        for (const item of items) {
            if (item == null || item.correct_answer == null || item.is_case_sensitive == null) {
                throw new BadRequestException('TypingExercise requires correct_answer and is_case_sensitive');
            }
            await this.typingExerciseModel.create({
                question_id: questionId,
                correct_answer: item.correct_answer,
                is_case_sensitive: item.is_case_sensitive
            }, { transaction });
        }
    }
};
ExerciseService = __decorate([
    Injectable(),
    __param(0, InjectModel(Exercise)),
    __param(1, InjectModel(Questions)),
    __param(2, InjectModel(Choices)),
    __param(3, InjectModel(GapFilling)),
    __param(4, InjectModel(MatchingExercise)),
    __param(5, InjectModel(TypingExercise)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Sequelize])
], ExerciseService);
export { ExerciseService };
//# sourceMappingURL=exercise.service.js.map