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
import { Op } from 'sequelize';
import { LessonProgress } from './entities/lesson_progress.entity.js';
import { HomeworkSubmission } from '../homework_submissions/entities/homework_submission.entity.js';
import { GroupHomework } from '../group_homeworks/entities/group_homework.entity.js';
let LessonProgressService = class LessonProgressService {
    constructor(lessonProgressModel, homeworkSubmissionModel, groupHomeworkModel) {
        this.lessonProgressModel = lessonProgressModel;
        this.homeworkSubmissionModel = homeworkSubmissionModel;
        this.groupHomeworkModel = groupHomeworkModel;
    }
    async create(createLessonProgressDto) {
        return this.lessonProgressModel.create({ ...createLessonProgressDto });
    }
    async findAll() {
        return this.lessonProgressModel.findAll();
    }
    async findOne(id) {
        const lessonProgress = await this.lessonProgressModel.findByPk(id);
        if (!lessonProgress) {
            throw new NotFoundException('Lesson progress not found');
        }
        return lessonProgress;
    }
    async findByStudentId(studentId) {
        return this.lessonProgressModel.findAll({
            where: { student_id: studentId }
        });
    }
    async findByLessonId(lessonId) {
        return this.lessonProgressModel.findAll({
            where: { lesson_id: lessonId }
        });
    }
    async findByStudentAndLesson(studentId, lessonId) {
        return this.lessonProgressModel.findOne({
            where: { student_id: studentId, lesson_id: lessonId }
        });
    }
    async getOrCreateProgress(studentId, lessonId) {
        let progress = await this.findByStudentAndLesson(studentId, lessonId);
        if (!progress) {
            progress = await this.create({
                student_id: studentId,
                lesson_id: lessonId,
                completed: false,
                progress_percentage: 0,
                reading_completed: false,
                listening_completed: false,
                grammar_completed: false,
                writing_completed: false,
                speaking_completed: false,
            });
        }
        return progress;
    }
    async updateSectionProgress(studentId, lessonId, section) {
        const progress = await this.getOrCreateProgress(studentId, lessonId);
        const sectionField = `${section}_completed`;
        const updateData = {};
        updateData[sectionField] = true;
        await progress.update(updateData);
        return this.recalculateProgress(progress);
    }
    async recalculateProgress(progress) {
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        let completedCount = 0;
        for (const section of sections) {
            const sectionField = `${section}_completed`;
            if (progress[sectionField]) {
                completedCount++;
            }
        }
        const progressPercentage = (completedCount / sections.length) * 100;
        const isCompleted = completedCount === sections.length;
        await progress.update({
            completed_sections_count: completedCount,
            progress_percentage: progressPercentage,
            completed: isCompleted,
        });
        return progress;
    }
    async updateProgressFromHomeworkSubmission(studentId, homeworkId, section) {
        const homework = await this.groupHomeworkModel.findByPk(homeworkId);
        if (!homework) {
            return null;
        }
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId,
                section: section,
                status: 'passed'
            }
        });
        if (!submission) {
            return null;
        }
        return this.updateSectionProgress(studentId, homework.lesson_id, section);
    }
    async getProgressByLessonAndStudent(studentId, lessonId) {
        const progress = await this.findByStudentAndLesson(studentId, lessonId);
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        if (!progress) {
            return {
                progress: null,
                completedSections: [],
                remainingSections: sections,
                progressPercentage: 0,
            };
        }
        const completedSections = sections.filter(section => {
            const sectionField = `${section}_completed`;
            return progress[sectionField];
        });
        const remainingSections = sections.filter(section => {
            const sectionField = `${section}_completed`;
            return !progress[sectionField];
        });
        return {
            progress,
            completedSections,
            remainingSections,
            progressPercentage: Number(progress.progress_percentage) || 0,
        };
    }
    async getStudentOverallProgress(studentId) {
        const progressDetails = await this.findByStudentId(studentId);
        const completedLessons = progressDetails.filter(p => p.completed).length;
        const inProgressLessons = progressDetails.filter(p => !p.completed && Number(p.progress_percentage) > 0).length;
        const totalProgress = progressDetails.reduce((sum, p) => sum + Number(p.progress_percentage), 0);
        const overallPercentage = progressDetails.length > 0 ? totalProgress / progressDetails.length : 0;
        return {
            totalLessons: progressDetails.length,
            completedLessons,
            inProgressLessons,
            overallPercentage: Math.round(overallPercentage * 100) / 100,
            progressDetails,
        };
    }
    async update(id, updateLessonProgressDto) {
        const lessonProgress = await this.findOne(id);
        await lessonProgress.update(updateLessonProgressDto);
        return lessonProgress;
    }
    async remove(id) {
        const lessonProgress = await this.findOne(id);
        await lessonProgress.destroy();
    }
    async getSectionProgressStats() {
        const allProgress = await this.lessonProgressModel.findAll();
        const totalRecords = allProgress.length;
        if (totalRecords === 0) {
            const emptyStats = { completed: 0, total: 0, percentage: 0 };
            return {
                reading: emptyStats,
                listening: emptyStats,
                grammar: emptyStats,
                writing: emptyStats,
                speaking: emptyStats,
            };
        }
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        const stats = {};
        for (const section of sections) {
            const sectionField = `${section}_completed`;
            const completed = allProgress.filter(p => p[sectionField] === true).length;
            const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;
            stats[section] = {
                completed,
                total: totalRecords,
                percentage,
            };
        }
        return stats;
    }
    async getStudentSectionProgressStats(studentId) {
        const studentProgress = await this.findByStudentId(studentId);
        const totalRecords = studentProgress.length;
        if (totalRecords === 0) {
            const emptyStats = { completed: 0, total: 0, percentage: 0 };
            return {
                reading: emptyStats,
                listening: emptyStats,
                grammar: emptyStats,
                writing: emptyStats,
                speaking: emptyStats,
            };
        }
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        const stats = {};
        for (const section of sections) {
            const sectionField = `${section}_completed`;
            const completed = studentProgress.filter(p => p[sectionField] === true).length;
            const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;
            stats[section] = {
                completed,
                total: totalRecords,
                percentage,
            };
        }
        return stats;
    }
    async getLessonSectionProgressStats(lessonId) {
        const lessonProgress = await this.findByLessonId(lessonId);
        const totalRecords = lessonProgress.length;
        if (totalRecords === 0) {
            const emptyStats = { completed: 0, total: 0, percentage: 0 };
            return {
                reading: emptyStats,
                listening: emptyStats,
                grammar: emptyStats,
                writing: emptyStats,
                speaking: emptyStats,
            };
        }
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        const stats = {};
        for (const section of sections) {
            const sectionField = `${section}_completed`;
            const completed = lessonProgress.filter(p => p[sectionField] === true).length;
            const percentage = Math.round((completed / totalRecords) * 100 * 100) / 100;
            stats[section] = {
                completed,
                total: totalRecords,
                percentage,
            };
        }
        return stats;
    }
    async getAverageSectionProgress() {
        const allProgress = await this.lessonProgressModel.findAll();
        if (allProgress.length === 0) {
            return {
                reading: 0,
                listening: 0,
                grammar: 0,
                writing: 0,
                speaking: 0,
                overall: 0,
            };
        }
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        const averages = {};
        let totalAverage = 0;
        for (const section of sections) {
            const sectionField = `${section}_completed`;
            const completed = allProgress.filter(p => p[sectionField] === true).length;
            const average = Math.round((completed / allProgress.length) * 100 * 100) / 100;
            averages[section] = average;
            totalAverage += average;
        }
        averages.overall = Math.round((totalAverage / sections.length) * 100) / 100;
        return averages;
    }
    async getTopPerformingStudentsBySection(section, limit = 10) {
        if (!['reading', 'listening', 'grammar', 'writing', 'speaking'].includes(section)) {
            throw new Error('Invalid section. Must be one of: reading, listening, grammar, writing, speaking');
        }
        const allProgress = await this.lessonProgressModel.findAll();
        const studentStats = new Map();
        for (const progress of allProgress) {
            const studentId = progress.student_id;
            const sectionField = `${section}_completed`;
            if (!studentStats.has(studentId)) {
                studentStats.set(studentId, { completed: 0, total: 0 });
            }
            const stats = studentStats.get(studentId);
            stats.total++;
            if (progress[sectionField]) {
                stats.completed++;
            }
        }
        const studentsWithRates = Array.from(studentStats.entries())
            .map(([student_id, stats]) => ({
            student_id,
            completed_lessons: stats.completed,
            total_lessons: stats.total,
            completion_rate: Math.round((stats.completed / stats.total) * 100 * 100) / 100,
        }))
            .sort((a, b) => b.completion_rate - a.completion_rate)
            .slice(0, limit);
        return {
            section,
            students: studentsWithRates,
        };
    }
    async getComprehensiveProgressReport() {
        const allProgress = await this.lessonProgressModel.findAll();
        const uniqueStudents = new Set(allProgress.map(p => p.student_id)).size;
        const uniqueLessons = new Set(allProgress.map(p => p.lesson_id)).size;
        const totalProgressPercentage = allProgress.reduce((sum, p) => sum + Number(p.progress_percentage), 0);
        const averageCompletionRate = allProgress.length > 0
            ? Math.round((totalProgressPercentage / allProgress.length) * 100) / 100
            : 0;
        const sectionAverages = await this.getAverageSectionProgress();
        const distribution = {
            completed_0_20: 0,
            completed_21_40: 0,
            completed_41_60: 0,
            completed_61_80: 0,
            completed_81_100: 0,
        };
        for (const progress of allProgress) {
            const percentage = Number(progress.progress_percentage);
            if (percentage <= 20)
                distribution.completed_0_20++;
            else if (percentage <= 40)
                distribution.completed_21_40++;
            else if (percentage <= 60)
                distribution.completed_41_60++;
            else if (percentage <= 80)
                distribution.completed_61_80++;
            else
                distribution.completed_81_100++;
        }
        const topPerformers = {};
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        for (const section of sections) {
            const sectionTopPerformers = await this.getTopPerformingStudentsBySection(section, 5);
            topPerformers[section] = sectionTopPerformers.students.map(s => ({
                student_id: s.student_id,
                completion_rate: s.completion_rate,
            }));
        }
        return {
            overall_stats: {
                total_students: uniqueStudents,
                total_lessons: uniqueLessons,
                average_completion_rate: averageCompletionRate,
            },
            section_averages: {
                reading: sectionAverages.reading,
                listening: sectionAverages.listening,
                grammar: sectionAverages.grammar,
                writing: sectionAverages.writing,
                speaking: sectionAverages.speaking,
            },
            completion_distribution: distribution,
            top_performers: topPerformers,
        };
    }
    async getStudentComparisonStats(studentIds) {
        const students = [];
        const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
        let groupTotals = { reading: 0, listening: 0, grammar: 0, writing: 0, speaking: 0, overall: 0 };
        for (const studentId of studentIds) {
            const studentProgress = await this.findByStudentId(studentId);
            const completedLessons = studentProgress.filter(p => p.completed).length;
            const totalLessons = studentProgress.length;
            const studentStats = {
                student_id: studentId,
                completed_lessons: completedLessons,
                total_lessons: totalLessons,
            };
            let totalSectionProgress = 0;
            for (const section of sections) {
                const sectionField = `${section}_completed`;
                const sectionCompleted = studentProgress.filter(p => p[sectionField] === true).length;
                const sectionProgress = totalLessons > 0 ? Math.round((sectionCompleted / totalLessons) * 100 * 100) / 100 : 0;
                studentStats[`${section}_progress`] = sectionProgress;
                groupTotals[section] += sectionProgress;
                totalSectionProgress += sectionProgress;
            }
            const overallProgress = Math.round((totalSectionProgress / sections.length) * 100) / 100;
            studentStats.overall_progress = overallProgress;
            groupTotals.overall += overallProgress;
            students.push(studentStats);
        }
        const studentCount = studentIds.length || 1;
        const groupAverages = {
            reading: Math.round((groupTotals.reading / studentCount) * 100) / 100,
            listening: Math.round((groupTotals.listening / studentCount) * 100) / 100,
            grammar: Math.round((groupTotals.grammar / studentCount) * 100) / 100,
            writing: Math.round((groupTotals.writing / studentCount) * 100) / 100,
            speaking: Math.round((groupTotals.speaking / studentCount) * 100) / 100,
            overall: Math.round((groupTotals.overall / studentCount) * 100) / 100,
        };
        return {
            students,
            group_averages: groupAverages,
        };
    }
    async getProgressTrends(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const allProgress = await this.lessonProgressModel.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                },
            },
            order: [['updatedAt', 'ASC']],
        });
        const dailyProgress = new Map();
        const sectionTrends = {
            reading: new Map(),
            listening: new Map(),
            grammar: new Map(),
            writing: new Map(),
            speaking: new Map(),
        };
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dailyProgress.set(dateStr, { completions: 0, total: 0 });
            Object.keys(sectionTrends).forEach(section => {
                sectionTrends[section].set(dateStr, 0);
            });
        }
        for (const progress of allProgress) {
            const dateStr = progress.updatedAt.toISOString().split('T')[0];
            if (dailyProgress.has(dateStr)) {
                const dayData = dailyProgress.get(dateStr);
                dayData.total++;
                if (progress.completed) {
                    dayData.completions++;
                }
                const sections = ['reading', 'listening', 'grammar', 'writing', 'speaking'];
                for (const section of sections) {
                    const sectionField = `${section}_completed`;
                    if (progress[sectionField]) {
                        const currentCount = sectionTrends[section].get(dateStr) || 0;
                        sectionTrends[section].set(dateStr, currentCount + 1);
                    }
                }
            }
        }
        let cumulativeCompletions = 0;
        const dailyProgressArray = Array.from(dailyProgress.entries()).map(([date, data]) => {
            cumulativeCompletions += data.completions;
            const averageProgress = data.total > 0 ? Math.round((data.completions / data.total) * 100 * 100) / 100 : 0;
            return {
                date,
                new_completions: data.completions,
                cumulative_completions: cumulativeCompletions,
                average_daily_progress: averageProgress,
            };
        });
        const sectionTrendsArray = {};
        Object.keys(sectionTrends).forEach(section => {
            sectionTrendsArray[section] = Array.from(sectionTrends[section].entries()).map(([date, completions]) => ({
                date,
                completions,
            }));
        });
        return {
            daily_progress: dailyProgressArray,
            section_trends: sectionTrendsArray,
        };
    }
};
LessonProgressService = __decorate([
    Injectable(),
    __param(0, InjectModel(LessonProgress)),
    __param(1, InjectModel(HomeworkSubmission)),
    __param(2, InjectModel(GroupHomework)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LessonProgressService);
export { LessonProgressService };
//# sourceMappingURL=lesson_progress.service.js.map