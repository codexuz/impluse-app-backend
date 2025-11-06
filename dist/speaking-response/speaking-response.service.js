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
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { SpeakingResponse } from "./entities/speaking-response.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { OpenaiService } from "../services/openai/openai.service.js";
import { StudentProfileService } from "../student_profiles/student-profile.service.js";
let SpeakingResponseService = class SpeakingResponseService {
    constructor(speakingResponseModel, speakingModel, openaiService, studentProfileService) {
        this.speakingResponseModel = speakingResponseModel;
        this.speakingModel = speakingModel;
        this.openaiService = openaiService;
        this.studentProfileService = studentProfileService;
    }
    async create(createSpeakingResponseDto) {
        let assessmentResult = null;
        let pronunciationScore = 0;
        if (createSpeakingResponseDto.response_type !== "pronunciation" &&
            createSpeakingResponseDto.transcription) {
            try {
                assessmentResult = await this.openaiService.assessSpeaking(createSpeakingResponseDto.transcription);
                if (assessmentResult && assessmentResult.speakingAssessment) {
                    const { fluency, grammar, vocabulary, pronunciation } = assessmentResult.speakingAssessment;
                    pronunciationScore = Math.round((fluency + grammar + vocabulary + pronunciation) / 4);
                }
            }
            catch (error) {
                console.error("Error assessing speaking response:", error);
            }
        }
        const speakingResponse = await this.speakingResponseModel.create({
            ...createSpeakingResponseDto,
            pronunciation_score: pronunciationScore,
            result: assessmentResult || null,
        });
        if (pronunciationScore >= 80 && createSpeakingResponseDto.student_id) {
            try {
                await this.studentProfileService.addCoins(createSpeakingResponseDto.student_id, 10);
                await this.studentProfileService.addPoints(createSpeakingResponseDto.student_id, 50);
                await this.studentProfileService.incrementStreak(createSpeakingResponseDto.student_id);
            }
            catch (error) {
                console.error("Error adding rewards:", error);
            }
        }
        return speakingResponse;
    }
    async findAll() {
        return this.speakingResponseModel.findAll();
    }
    async findOne(id) {
        const response = await this.speakingResponseModel.findByPk(id);
        if (!response) {
            throw new NotFoundException(`Speaking response with ID ${id} not found`);
        }
        return response;
    }
    async findBySpeakingId(speakingId) {
        return this.speakingResponseModel.findAll({
            where: {
                speaking_id: speakingId,
            },
            include: [
                {
                    model: Speaking,
                    as: "speaking",
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }
    async findByType(responseType) {
        return this.speakingResponseModel.findAll({
            where: {
                response_type: responseType,
            },
            order: [["createdAt", "DESC"]],
        });
    }
    async findByStudentId(studentId) {
        return this.speakingResponseModel.findAll({
            where: {
                student_id: studentId,
            },
            order: [["createdAt", "DESC"]],
        });
    }
    async checkSubmission(lessonId, studentId) {
        const speakingExercises = await this.speakingModel.findAll({
            where: {
                lessonId: lessonId,
            },
            attributes: ["id"],
        });
        if (speakingExercises.length === 0) {
            return [];
        }
        const speakingIds = speakingExercises.map((exercise) => exercise.id);
        const responses = await this.speakingResponseModel.findAll({
            where: {
                speaking_id: speakingIds,
                student_id: studentId,
            },
        });
        const responseMap = new Map();
        responses.forEach((response) => {
            responseMap.set(response.speaking_id, response);
        });
        const exerciseDetails = speakingExercises.map((exercise) => {
            const response = responseMap.get(exercise.id);
            return {
                id: response?.id || null,
                speaking_id: exercise.id,
                completed: !!response,
                response_type: response?.response_type || null,
                pronunciation_score: response?.pronunciation_score || null,
                feedback: response?.feedback || null,
                result: response?.result || null,
                transcription: response?.transcription || null,
            };
        });
        return exerciseDetails;
    }
    async update(id, updateSpeakingResponseDto) {
        const response = await this.findOne(id);
        await response.update(updateSpeakingResponseDto);
        return response;
    }
    async remove(id) {
        const response = await this.findOne(id);
        await response.destroy();
    }
};
SpeakingResponseService = __decorate([
    Injectable(),
    __param(0, InjectModel(SpeakingResponse)),
    __param(1, InjectModel(Speaking)),
    __metadata("design:paramtypes", [Object, Object, OpenaiService,
        StudentProfileService])
], SpeakingResponseService);
export { SpeakingResponseService };
//# sourceMappingURL=speaking-response.service.js.map