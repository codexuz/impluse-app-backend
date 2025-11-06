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
import { Op } from "sequelize";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import { LessonProgressService } from "../lesson_progress/lesson_progress.service.js";
import { SpeakingResponse } from "../speaking-response/entities/speaking-response.entity.js";
import { GroupStudentsService } from "../group-students/group-students.service.js";
import { OpenaiService } from "../services/openai/openai.service.js";
let HomeworkSubmissionsService = class HomeworkSubmissionsService {
    constructor(homeworkSubmissionModel, homeworkSectionModel, speakingResponseModel, lessonProgressService, groupStudentsService, openaiService) {
        this.homeworkSubmissionModel = homeworkSubmissionModel;
        this.homeworkSectionModel = homeworkSectionModel;
        this.speakingResponseModel = speakingResponseModel;
        this.lessonProgressService = lessonProgressService;
        this.groupStudentsService = groupStudentsService;
        this.openaiService = openaiService;
    }
    async create(createHomeworkSubmissionDto) {
        const submission = await this.homeworkSubmissionModel.create({
            homework_id: createHomeworkSubmissionDto.homework_id,
            student_id: createHomeworkSubmissionDto.student_id,
            lesson_id: createHomeworkSubmissionDto.lesson_id,
        });
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
    async findAll() {
        return await this.homeworkSubmissionModel.findAll({
            include: [
                {
                    model: this.homeworkSectionModel,
                    as: "sections",
                },
            ],
        });
    }
    async findOne(id) {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: { id },
        });
        if (!submission) {
            throw new NotFoundException(`Homework submission with ID ${id} not found`);
        }
        return submission;
    }
    async findByHomeworkId(homeworkId) {
        return await this.homeworkSubmissionModel.findAll({
            where: { homework_id: homeworkId },
            include: [
                {
                    model: this.homeworkSectionModel,
                    as: "sections",
                    attributes: [
                        "id",
                        "exercise_id",
                        "speaking_id",
                        "score",
                        "section",
                        "answers",
                        "createdAt",
                        "updatedAt",
                    ],
                },
                {
                    model: this.homeworkSubmissionModel.sequelize.models.User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                        "phone",
                    ],
                },
            ],
            order: [
                ["createdAt", "DESC"],
                [
                    { model: this.homeworkSectionModel, as: "sections" },
                    "createdAt",
                    "ASC",
                ],
            ],
        });
    }
    async findByStudentId(studentId) {
        return await this.homeworkSubmissionModel.findAll({
            where: { student_id: studentId },
        });
    }
    async findByStudentAndHomework(studentId, homeworkId) {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId,
            },
        });
        if (!submission) {
            throw new NotFoundException(`Homework submission not found for student ${studentId} and homework ${homeworkId}`);
        }
        return submission;
    }
    async update(id, updateHomeworkSubmissionDto) {
        const submission = await this.findOne(id);
        await submission.update(updateHomeworkSubmissionDto);
        return submission;
    }
    async updateFeedback(id, feedback) {
        const submission = await this.findOne(id);
        await submission.update({ feedback });
        return submission;
    }
    async updateStatus(id, status) {
        const submission = await this.findOne(id);
        const sections = await this.homeworkSectionModel.findAll({
            where: { submission_id: submission.id },
        });
        if (status === "passed" &&
            submission.student_id &&
            submission.homework_id) {
            for (const section of sections) {
                try {
                    await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, section.section);
                }
                catch (error) {
                    console.warn("Failed to update lesson progress:", error);
                }
            }
        }
        return submission;
    }
    async saveBySection(createHomeworkSubmissionDto) {
        let submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: createHomeworkSubmissionDto.student_id,
                homework_id: createHomeworkSubmissionDto.homework_id,
            },
            attributes: [
                "id",
                "homework_id",
                "student_id",
                "lesson_id",
                "createdAt",
                "updatedAt",
            ],
        });
        if (!submission) {
            submission = await this.homeworkSubmissionModel.create({
                homework_id: createHomeworkSubmissionDto.homework_id,
                student_id: createHomeworkSubmissionDto.student_id,
                lesson_id: createHomeworkSubmissionDto.lesson_id,
            });
        }
        let section = null;
        if (createHomeworkSubmissionDto.exercise_id) {
            section = await this.homeworkSectionModel.findOne({
                where: {
                    submission_id: submission.id,
                    section: createHomeworkSubmissionDto.section,
                    exercise_id: createHomeworkSubmissionDto.exercise_id,
                },
            });
        }
        if (section) {
            await section.update({
                score: createHomeworkSubmissionDto.percentage,
                speaking_id: createHomeworkSubmissionDto.speaking_id,
                answers: createHomeworkSubmissionDto.answers || {},
            });
        }
        else {
            section = await this.homeworkSectionModel.create({
                submission_id: submission.id,
                exercise_id: createHomeworkSubmissionDto.exercise_id,
                speaking_id: createHomeworkSubmissionDto.speaking_id,
                score: createHomeworkSubmissionDto.percentage,
                section: createHomeworkSubmissionDto.section,
                answers: createHomeworkSubmissionDto.answers || {},
            });
        }
        if (createHomeworkSubmissionDto.section === "writing") {
            try {
                section = await this.checkWritingAnswers(section.id, "General Writing");
                console.log(`Writing section ${section.id} automatically assessed with score: ${section.score}`);
            }
            catch (error) {
                console.warn("Failed to automatically assess writing section:", error);
            }
        }
        if (section.score &&
            section.score >= 60 &&
            submission.student_id &&
            submission.lesson_id &&
            submission.homework_id) {
            try {
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, section.section);
                await this.checkAndUpdateAllSectionsCompleted(submission);
            }
            catch (error) {
                console.warn("Failed to update lesson progress:", error);
            }
        }
        return { submission, section };
    }
    async checkAndUpdateAllSectionsCompleted(submission) {
        if (!submission.lesson_id || !submission.student_id) {
            return;
        }
        try {
            const submissions = await this.homeworkSubmissionModel.findAll({
                where: {
                    student_id: submission.student_id,
                    lesson_id: submission.lesson_id,
                },
                attributes: ["id", "student_id", "lesson_id", "homework_id"],
            });
            const submissionIds = submissions.map((sub) => sub.id);
            const sections = await this.homeworkSectionModel.findAll({
                where: {
                    submission_id: { [Op.in]: submissionIds },
                    score: { [Op.gte]: 60 },
                },
            });
            const completedSectionTypes = new Set(sections.map((s) => s.section));
            const progress = await this.lessonProgressService.findByStudentAndLesson(submission.student_id, submission.lesson_id);
            if (!progress) {
                return;
            }
            const sectionTypes = [
                "reading",
                "listening",
                "grammar",
                "writing",
                "speaking",
            ];
            const updateData = {};
            for (const section of sectionTypes) {
                if (completedSectionTypes.has(section)) {
                    const sectionField = `${section}_completed`;
                    updateData[sectionField] = true;
                }
            }
            await progress.update(updateData);
            await this.lessonProgressService.recalculateProgress(progress);
            console.log(`Updated lesson progress for student ${submission.student_id}, lesson ${submission.lesson_id}`);
        }
        catch (error) {
            console.error("Error checking all sections completed:", error);
        }
    }
    async findBySection(section) {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: "submission",
                },
            ],
        });
    }
    async findByStudentAndSection(studentId, section) {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: "submission",
                    where: { student_id: studentId },
                },
            ],
        });
    }
    async findByHomeworkAndSection(homeworkId, section) {
        return await this.homeworkSectionModel.findAll({
            where: { section },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: "submission",
                    where: { homework_id: homeworkId },
                },
            ],
        });
    }
    async findByStudentHomeworkAndSection(studentId, homeworkId, section) {
        const homeworkSection = await this.homeworkSectionModel.findOne({
            where: { section },
            include: [
                {
                    model: this.homeworkSubmissionModel,
                    as: "submission",
                    where: {
                        student_id: studentId,
                        homework_id: homeworkId,
                    },
                },
            ],
        });
        if (!homeworkSection) {
            throw new NotFoundException(`Homework section not found for student ${studentId}, homework ${homeworkId}, and section ${section}`);
        }
        return homeworkSection;
    }
    async remove(id) {
        const submission = await this.findOne(id);
        await submission.destroy();
    }
    async updateSection(sectionId, updateData) {
        const section = await this.homeworkSectionModel.findOne({
            where: { id: sectionId },
        });
        if (!section) {
            throw new NotFoundException(`Homework section with ID ${sectionId} not found`);
        }
        await section.update({
            ...(updateData.exercise_id !== undefined
                ? { exercise_id: updateData.exercise_id }
                : {}),
            ...(updateData.speaking_id !== undefined
                ? { speaking_id: updateData.speaking_id }
                : {}),
            ...(updateData.score !== undefined ? { score: updateData.score } : {}),
            ...(updateData.section !== undefined
                ? { section: updateData.section }
                : {}),
            ...(updateData.answers !== undefined
                ? { answers: updateData.answers }
                : {}),
        });
        const submission = await this.homeworkSubmissionModel.findOne({
            where: { id: section.submission_id },
        });
        try {
            if (section.score !== null &&
                section.score !== undefined &&
                section.score >= 60 &&
                submission &&
                submission.student_id &&
                submission.homework_id) {
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, section.section);
            }
        }
        catch (error) {
            console.warn("Failed to update lesson progress after section update:", error);
        }
        if (submission) {
            try {
                await this.checkAndUpdateAllSectionsCompleted(submission);
            }
            catch (error) {
                console.warn("Failed to re-evaluate sections after update:", error);
            }
        }
        return section;
    }
    async getExercisesWithScoresByStudentAndHomework(studentId, homeworkId, section) {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId,
            },
            attributes: ["id"],
        });
        if (!submission) {
            return [];
        }
        const whereClause = {
            submission_id: submission.id,
        };
        if (section) {
            whereClause.section = section;
        }
        const sections = await this.homeworkSectionModel.findAll({
            where: whereClause,
            include: [
                {
                    model: this.homeworkSubmissionModel.sequelize.models.Exercise,
                    as: "exercise",
                    attributes: ["id", "title", "exercise_type", "lesson_id"],
                },
            ],
            attributes: ["id", "exercise_id", "score", "section", "answers"],
        });
        return sections.map((section) => {
            const data = section.toJSON();
            const isCompleted = section.score >= 60;
            return {
                ...data,
                completed: isCompleted,
                exercise: data.exercise
                    ? {
                        ...data.exercise,
                        completed: isCompleted,
                        score: section.score,
                    }
                    : null,
            };
        });
    }
    async getStudentHomeworkStatsBySection(studentId, startDate, endDate) {
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: studentId,
            },
            attributes: ["id"],
            order: [["createdAt", "ASC"]],
        });
        const speakingResponses = await this.speakingResponseModel.findAll({
            where: {
                student_id: studentId,
                pronunciation_score: {
                    [Op.not]: null,
                },
            },
            attributes: ["pronunciation_score", "createdAt"],
        });
        if ((!submissions || submissions.length === 0) &&
            speakingResponses.length === 0) {
            return {
                overall: 0,
                sections: {},
            };
        }
        const submissionIds = submissions.map((sub) => sub.id);
        const dateFilter = {};
        if (!startDate && !endDate) {
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            dateFilter["createdAt"] = {
                [Op.gte]: oneMonthAgo,
                [Op.lte]: today,
            };
        }
        else {
            if (startDate) {
                dateFilter["createdAt"] = {
                    [Op.gte]: new Date(startDate),
                };
            }
            if (endDate) {
                dateFilter["createdAt"] = {
                    ...dateFilter["createdAt"],
                    [Op.lte]: new Date(endDate),
                };
            }
        }
        let filteredSpeakingResponses = speakingResponses;
        if (dateFilter["createdAt"]) {
            const { [Op.gte]: startDateFilter, [Op.lte]: endDateFilter } = dateFilter["createdAt"];
            filteredSpeakingResponses = speakingResponses.filter((response) => {
                const responseDate = new Date(response.get("createdAt"));
                return ((!startDateFilter || responseDate >= startDateFilter) &&
                    (!endDateFilter || responseDate <= endDateFilter));
            });
        }
        let sections = [];
        if (submissionIds.length > 0) {
            sections = await this.homeworkSectionModel.findAll({
                where: {
                    submission_id: { [Op.in]: submissionIds },
                    ...dateFilter,
                },
                order: [["createdAt", "ASC"]],
                attributes: ["section", "score", "createdAt"],
            });
        }
        const sectionTypes = [
            "reading",
            "listening",
            "grammar",
            "writing",
            "speaking",
        ];
        const result = {
            overall: 0,
            sections: {},
        };
        sectionTypes.forEach((sectionType) => {
            result.sections[sectionType] = {
                average: 0,
                submissions: 0,
                trend: [],
            };
        });
        let totalScore = 0;
        let totalSubmissions = 0;
        sections.forEach((section) => {
            if (section.section &&
                section.section !== "speaking" &&
                sectionTypes.includes(section.section)) {
                if (section.score !== null && section.score !== undefined) {
                    result.sections[section.section].submissions += 1;
                    result.sections[section.section].average += section.score;
                    result.sections[section.section].trend.push(section.score);
                    totalScore += section.score;
                    totalSubmissions += 1;
                }
            }
        });
        filteredSpeakingResponses.forEach((response) => {
            const score = response.pronunciation_score;
            if (score !== null && score !== undefined) {
                result.sections.speaking.submissions += 1;
                result.sections.speaking.average += score;
                result.sections.speaking.trend.push(score);
                totalScore += score;
                totalSubmissions += 1;
            }
        });
        if (totalSubmissions > 0) {
            result.overall = parseFloat((totalScore / totalSubmissions).toFixed(2));
            sectionTypes.forEach((sectionType) => {
                if (result.sections[sectionType].submissions > 0) {
                    result.sections[sectionType].average = parseFloat((result.sections[sectionType].average /
                        result.sections[sectionType].submissions).toFixed(2));
                }
            });
        }
        return result;
    }
    async getHomeworkSectionsBySpeakingId(speakingId, studentId) {
        const whereClause = {
            speaking_id: speakingId,
        };
        const includeOptions = [
            {
                model: this.homeworkSubmissionModel,
                as: "submission",
                attributes: [
                    "id",
                    "student_id",
                    "homework_id",
                    "lesson_id",
                    "createdAt",
                ],
            },
        ];
        if (studentId) {
            includeOptions[0].where = { student_id: studentId };
        }
        const sections = await this.homeworkSectionModel.findAll({
            where: whereClause,
            include: includeOptions,
            order: [["createdAt", "DESC"]],
            attributes: [
                "id",
                "score",
                "section",
                "answers",
                "speaking_id",
                "createdAt",
                "updatedAt",
            ],
        });
        return sections.map((section) => {
            const data = section.toJSON();
            const isCompleted = section.score >= 60;
            return {
                ...data,
                completed: isCompleted,
            };
        });
    }
    async getStudentAverageSpeakingScore(studentId) {
        const speakingResponses = await this.speakingResponseModel.findAll({
            where: {
                student_id: studentId,
                pronunciation_score: {
                    [Op.not]: null,
                },
            },
            attributes: ["pronunciation_score"],
        });
        if (speakingResponses.length === 0) {
            return 0;
        }
        const totalScore = speakingResponses.reduce((sum, response) => {
            return sum + (response.pronunciation_score || 0);
        }, 0);
        return parseFloat((totalScore / speakingResponses.length).toFixed(2));
    }
    async checkWritingAnswers(sectionId, taskType) {
        const section = await this.homeworkSectionModel.findOne({
            where: { id: sectionId },
        });
        if (!section) {
            throw new NotFoundException(`Homework section with ID ${sectionId} not found`);
        }
        if (section.section !== "writing") {
            throw new Error(`This method can only be used for writing sections. Current section type: ${section.section}`);
        }
        const answers = section.answers;
        if (!answers || !answers.writing) {
            throw new Error("No writing content found in the answers. Expected format: {writing: 'student writing text'}");
        }
        const writingText = answers.writing;
        try {
            const assessment = await this.openaiService.assessWriting(writingText, taskType);
            const updatedAnswers = {
                ...answers,
                assessment: {
                    ...assessment,
                    assessedAt: new Date().toISOString(),
                    taskType: taskType || "General Writing",
                },
            };
            await section.update({
                score: assessment.score,
                answers: updatedAnswers,
            });
            const submission = await this.homeworkSubmissionModel.findOne({
                where: { id: section.submission_id },
            });
            if (assessment.score >= 20 &&
                submission &&
                submission.student_id &&
                submission.homework_id) {
                try {
                    await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, section.section);
                    await this.checkAndUpdateAllSectionsCompleted(submission);
                }
                catch (error) {
                    console.warn("Failed to update lesson progress:", error);
                }
            }
            return section;
        }
        catch (error) {
            console.error("Error assessing writing with OpenAI:", error);
            throw new Error(`Failed to assess writing: ${error.message || "Unknown error"}`);
        }
    }
    async bulkCheckWritingAnswers(sectionIds, taskType) {
        const results = [];
        for (const sectionId of sectionIds) {
            try {
                const section = await this.checkWritingAnswers(sectionId, taskType);
                results.push({
                    sectionId,
                    success: true,
                    section,
                });
            }
            catch (error) {
                results.push({
                    sectionId,
                    success: false,
                    error: error.message,
                });
            }
        }
        return results;
    }
    async findHomeworksByGroupId(groupId) {
        const groupStudents = await this.groupStudentsService.findActiveByGroupId(groupId);
        if (!groupStudents || groupStudents.length === 0) {
            return [];
        }
        const studentIds = groupStudents.map((gs) => gs.student_id);
        const submissions = await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: studentIds,
            },
            include: [
                {
                    model: this.homeworkSectionModel,
                    as: "sections",
                },
                {
                    model: this.homeworkSubmissionModel.sequelize.models.User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return submissions;
    }
};
HomeworkSubmissionsService = __decorate([
    Injectable(),
    __param(0, InjectModel(HomeworkSubmission)),
    __param(1, InjectModel(HomeworkSection)),
    __param(2, InjectModel(SpeakingResponse)),
    __metadata("design:paramtypes", [Object, Object, Object, LessonProgressService,
        GroupStudentsService,
        OpenaiService])
], HomeworkSubmissionsService);
export { HomeworkSubmissionsService };
//# sourceMappingURL=homework_submissions.service.js.map