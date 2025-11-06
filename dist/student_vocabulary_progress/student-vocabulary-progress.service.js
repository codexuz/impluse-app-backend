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
import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
let StudentVocabularyProgressService = class StudentVocabularyProgressService {
    constructor(studentVocabularyProgressModel) {
        this.studentVocabularyProgressModel = studentVocabularyProgressModel;
    }
    async create(createDto) {
        return this.studentVocabularyProgressModel.create({
            ...createDto,
            attempts_count: 1
        });
    }
    async findAll() {
        return this.studentVocabularyProgressModel.findAll();
    }
    async findOne(id) {
        const progress = await this.studentVocabularyProgressModel.findByPk(id);
        if (!progress) {
            throw new NotFoundException(`Progress with ID ${id} not found`);
        }
        return progress;
    }
    async findByStudent(studentId) {
        return this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId }
        });
    }
    async findByVocabularyItem(vocabularyItemId) {
        return this.studentVocabularyProgressModel.findAll({
            where: { vocabulary_item_id: vocabularyItemId }
        });
    }
    async findByStudentAndVocabularyItem(studentId, vocabularyItemId) {
        const progress = await this.studentVocabularyProgressModel.findOne({
            where: {
                student_id: studentId,
                vocabulary_item_id: vocabularyItemId
            }
        });
        if (!progress) {
            throw new NotFoundException(`Progress not found for student ${studentId} and vocabulary item ${vocabularyItemId}`);
        }
        return progress;
    }
    async update(id, updateDto) {
        const progress = await this.findOne(id);
        await progress.update(updateDto);
        return progress;
    }
    async remove(id) {
        const progress = await this.findOne(id);
        await progress.destroy();
    }
    async updateStatus(id, status) {
        const progress = await this.findOne(id);
        await progress.update({ status });
        return progress;
    }
    async updateStatusByVocabularyItemId(vocabularyItemId, status) {
        const progressRecords = await this.findByVocabularyItem(vocabularyItemId);
        if (progressRecords.length === 0) {
            throw new NotFoundException(`No progress records found for vocabulary item ${vocabularyItemId}`);
        }
        const updatePromises = progressRecords.map(progress => progress.update({ status }));
        await Promise.all(updatePromises);
        return progressRecords;
    }
    async incrementAttempts(id) {
        const progress = await this.findOne(id);
        await progress.update({
            attempts_count: progress.attempts_count + 1
        });
        return progress;
    }
    async recordAttempt(studentId, vocabularyItemId, status = VocabularyProgressStatus.LEARNING) {
        try {
            const existingProgress = await this.findByStudentAndVocabularyItem(studentId, vocabularyItemId);
            return this.incrementAttempts(existingProgress.id);
        }
        catch (error) {
            return this.create({
                student_id: studentId,
                vocabulary_item_id: vocabularyItemId,
                status: status
            });
        }
    }
    async getStudentProgressStats(studentId) {
        const progress = await this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId }
        });
        return {
            [VocabularyProgressStatus.LEARNING]: progress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
            [VocabularyProgressStatus.REVIEWING]: progress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
            [VocabularyProgressStatus.MASTERED]: progress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length,
        };
    }
    async getDetailedStudentStats(studentId) {
        const progress = await this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId },
            order: [['updatedAt', 'DESC']]
        });
        if (progress.length === 0) {
            return {
                totalVocabularyItems: 0,
                statusCounts: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                statusPercentages: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                completionRate: 0,
                masteryRate: 0,
                averageAttempts: 0,
                totalAttempts: 0,
                recentProgress: [],
                learningItems: [],
                mostAttemptedItems: []
            };
        }
        const statusCounts = {
            [VocabularyProgressStatus.LEARNING]: progress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
            [VocabularyProgressStatus.REVIEWING]: progress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
            [VocabularyProgressStatus.MASTERED]: progress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length
        };
        const totalItems = progress.length;
        const statusPercentages = {
            [VocabularyProgressStatus.LEARNING]: Math.round((statusCounts[VocabularyProgressStatus.LEARNING] / totalItems) * 100),
            [VocabularyProgressStatus.REVIEWING]: Math.round((statusCounts[VocabularyProgressStatus.REVIEWING] / totalItems) * 100),
            [VocabularyProgressStatus.MASTERED]: Math.round((statusCounts[VocabularyProgressStatus.MASTERED] / totalItems) * 100)
        };
        const completedItems = statusCounts[VocabularyProgressStatus.REVIEWING] + statusCounts[VocabularyProgressStatus.MASTERED];
        const completionRate = Math.round((completedItems / totalItems) * 100);
        const masteryRate = Math.round((statusCounts[VocabularyProgressStatus.MASTERED] / totalItems) * 100);
        const totalAttempts = progress.reduce((sum, item) => sum + item.attempts_count, 0);
        const averageAttempts = Math.round((totalAttempts / totalItems) * 10) / 10;
        const recentProgress = progress.slice(0, 10);
        const learningItems = progress
            .filter(p => p.status === VocabularyProgressStatus.LEARNING)
            .slice(0, 10);
        const mostAttemptedItems = [...progress]
            .sort((a, b) => b.attempts_count - a.attempts_count)
            .slice(0, 10);
        return {
            totalVocabularyItems: totalItems,
            statusCounts,
            statusPercentages,
            completionRate,
            masteryRate,
            totalAttempts,
            averageAttempts,
            recentProgress,
            learningItems,
            mostAttemptedItems
        };
    }
    async getVocabularyItemStats(vocabularyItemId) {
        const progress = await this.studentVocabularyProgressModel.findAll({
            where: { vocabulary_item_id: vocabularyItemId }
        });
        if (progress.length === 0) {
            return {
                totalStudents: 0,
                statusCounts: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                statusPercentages: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                masteryRate: 0,
                difficultyScore: 0,
                totalAttempts: 0,
                averageAttempts: 0,
                attemptsToMastery: 0
            };
        }
        const statusCounts = {
            [VocabularyProgressStatus.LEARNING]: progress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
            [VocabularyProgressStatus.REVIEWING]: progress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
            [VocabularyProgressStatus.MASTERED]: progress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length
        };
        const totalStudents = progress.length;
        const statusPercentages = {
            [VocabularyProgressStatus.LEARNING]: Math.round((statusCounts[VocabularyProgressStatus.LEARNING] / totalStudents) * 100),
            [VocabularyProgressStatus.REVIEWING]: Math.round((statusCounts[VocabularyProgressStatus.REVIEWING] / totalStudents) * 100),
            [VocabularyProgressStatus.MASTERED]: Math.round((statusCounts[VocabularyProgressStatus.MASTERED] / totalStudents) * 100)
        };
        const masteryRate = Math.round((statusCounts[VocabularyProgressStatus.MASTERED] / totalStudents) * 100);
        const difficultyScore = Math.round(100 - masteryRate);
        const totalAttempts = progress.reduce((sum, item) => sum + item.attempts_count, 0);
        const averageAttempts = Math.round((totalAttempts / totalStudents) * 10) / 10;
        const masteredItems = progress.filter(p => p.status === VocabularyProgressStatus.MASTERED);
        const attemptsToMastery = masteredItems.length > 0
            ? Math.round((masteredItems.reduce((sum, item) => sum + item.attempts_count, 0) / masteredItems.length) * 10) / 10
            : 0;
        return {
            totalStudents,
            statusCounts,
            statusPercentages,
            masteryRate,
            difficultyScore,
            totalAttempts,
            averageAttempts,
            attemptsToMastery
        };
    }
    async getGlobalStats() {
        const allProgress = await this.studentVocabularyProgressModel.findAll();
        if (allProgress.length === 0) {
            return {
                totalStudents: 0,
                totalVocabularyItems: 0,
                totalRecords: 0,
                globalStatusCounts: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                globalStatusPercentages: {
                    [VocabularyProgressStatus.LEARNING]: 0,
                    [VocabularyProgressStatus.REVIEWING]: 0,
                    [VocabularyProgressStatus.MASTERED]: 0
                },
                globalMasteryRate: 0,
                totalAttempts: 0,
                averageAttemptsPerItem: 0,
                averageAttemptsToMastery: 0,
                mostDifficultItems: [],
                mostMasteredItems: []
            };
        }
        const uniqueStudents = new Set(allProgress.map(p => p.student_id)).size;
        const uniqueVocabularyItems = new Set(allProgress.map(p => p.vocabulary_item_id)).size;
        const globalStatusCounts = {
            [VocabularyProgressStatus.LEARNING]: allProgress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
            [VocabularyProgressStatus.REVIEWING]: allProgress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
            [VocabularyProgressStatus.MASTERED]: allProgress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length
        };
        const totalRecords = allProgress.length;
        const globalStatusPercentages = {
            [VocabularyProgressStatus.LEARNING]: Math.round((globalStatusCounts[VocabularyProgressStatus.LEARNING] / totalRecords) * 100),
            [VocabularyProgressStatus.REVIEWING]: Math.round((globalStatusCounts[VocabularyProgressStatus.REVIEWING] / totalRecords) * 100),
            [VocabularyProgressStatus.MASTERED]: Math.round((globalStatusCounts[VocabularyProgressStatus.MASTERED] / totalRecords) * 100)
        };
        const globalMasteryRate = Math.round((globalStatusCounts[VocabularyProgressStatus.MASTERED] / totalRecords) * 100);
        const vocabularyItemStats = new Map();
        const totalAttempts = allProgress.reduce((sum, item) => sum + item.attempts_count, 0);
        allProgress.forEach(item => {
            const vocabId = item.vocabulary_item_id;
            if (!vocabularyItemStats.has(vocabId)) {
                vocabularyItemStats.set(vocabId, {
                    totalStudents: 0,
                    mastered: 0,
                    totalAttempts: 0
                });
            }
            const stats = vocabularyItemStats.get(vocabId);
            stats.totalStudents++;
            stats.totalAttempts += item.attempts_count;
            if (item.status === VocabularyProgressStatus.MASTERED) {
                stats.mastered++;
            }
        });
        const itemAnalytics = [];
        vocabularyItemStats.forEach((stats, vocabularyItemId) => {
            const masteryRate = Math.round((stats.mastered / stats.totalStudents) * 100);
            const difficultyScore = Math.round(100 - masteryRate);
            const averageAttempts = Math.round((stats.totalAttempts / stats.totalStudents) * 10) / 10;
            itemAnalytics.push({
                vocabularyItemId,
                masteryRate,
                difficultyScore,
                totalStudents: stats.totalStudents,
                averageAttempts
            });
        });
        const averageAttemptsPerItem = totalRecords > 0
            ? Math.round((totalAttempts / totalRecords) * 10) / 10
            : 0;
        const masteredProgress = allProgress.filter(p => p.status === VocabularyProgressStatus.MASTERED);
        const averageAttemptsToMastery = masteredProgress.length > 0
            ? Math.round((masteredProgress.reduce((sum, item) => sum + item.attempts_count, 0) / masteredProgress.length) * 10) / 10
            : 0;
        const mostDifficultItems = [...itemAnalytics]
            .sort((a, b) => b.difficultyScore - a.difficultyScore)
            .slice(0, 10)
            .map(item => ({
            vocabularyItemId: item.vocabularyItemId,
            difficultyScore: item.difficultyScore,
            masteryRate: item.masteryRate,
            averageAttempts: item.averageAttempts
        }));
        const mostMasteredItems = [...itemAnalytics]
            .filter(item => item.totalStudents >= 5)
            .sort((a, b) => b.masteryRate - a.masteryRate)
            .slice(0, 10)
            .map(item => ({
            vocabularyItemId: item.vocabularyItemId,
            masteryRate: item.masteryRate,
            totalStudents: item.totalStudents,
            averageAttempts: item.averageAttempts
        }));
        return {
            totalStudents: uniqueStudents,
            totalVocabularyItems: uniqueVocabularyItems,
            totalRecords,
            globalStatusCounts,
            globalStatusPercentages,
            globalMasteryRate,
            totalAttempts,
            averageAttemptsPerItem,
            averageAttemptsToMastery,
            mostDifficultItems,
            mostMasteredItems
        };
    }
    async getStudentRankings(limit = 10) {
        const allProgress = await this.studentVocabularyProgressModel.findAll();
        if (allProgress.length === 0) {
            return [];
        }
        const studentStats = new Map();
        allProgress.forEach(item => {
            const studentId = item.student_id;
            if (!studentStats.has(studentId)) {
                studentStats.set(studentId, {
                    totalItems: 0,
                    masteredItems: 0,
                    totalAttempts: 0
                });
            }
            const stats = studentStats.get(studentId);
            stats.totalItems++;
            stats.totalAttempts += item.attempts_count;
            if (item.status === VocabularyProgressStatus.MASTERED) {
                stats.masteredItems++;
            }
        });
        const rankings = [];
        studentStats.forEach((stats, studentId) => {
            const masteryRate = Math.round((stats.masteredItems / stats.totalItems) * 100);
            const averageAttempts = Math.round((stats.totalAttempts / stats.totalItems) * 10) / 10;
            rankings.push({
                studentId,
                totalItems: stats.totalItems,
                masteredItems: stats.masteredItems,
                masteryRate,
                totalAttempts: stats.totalAttempts,
                averageAttempts
            });
        });
        return rankings
            .sort((a, b) => b.masteryRate - a.masteryRate)
            .slice(0, limit);
    }
    async getStudentEfficiencyRankings(limit = 10) {
        const allProgress = await this.studentVocabularyProgressModel.findAll({
            where: { status: VocabularyProgressStatus.MASTERED }
        });
        if (allProgress.length === 0) {
            return [];
        }
        const studentStats = new Map();
        allProgress.forEach(item => {
            const studentId = item.student_id;
            if (!studentStats.has(studentId)) {
                studentStats.set(studentId, {
                    masteredItems: 0,
                    totalAttemptsToMastery: 0
                });
            }
            const stats = studentStats.get(studentId);
            stats.masteredItems++;
            stats.totalAttemptsToMastery += item.attempts_count;
        });
        const rankings = [];
        studentStats.forEach((stats, studentId) => {
            if (stats.masteredItems >= 5) {
                const averageAttemptsToMastery = Math.round((stats.totalAttemptsToMastery / stats.masteredItems) * 10) / 10;
                const efficiency = Math.round(100 * Math.max(0, Math.min(1, 1 - (averageAttemptsToMastery - 1) / 9)));
                rankings.push({
                    studentId,
                    masteredItems: stats.masteredItems,
                    averageAttemptsToMastery,
                    efficiency
                });
            }
        });
        return rankings
            .sort((a, b) => b.efficiency - a.efficiency)
            .slice(0, limit);
    }
    async getProgressTrends(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const progressUpdates = await this.studentVocabularyProgressModel.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                },
                status: VocabularyProgressStatus.MASTERED
            },
            order: [['updatedAt', 'ASC']]
        });
        const dailyProgress = new Map();
        const weeklyProgress = new Map();
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dailyProgress.set(dateStr, {
                newMasteries: 0,
                totalMasteries: 0,
                cumulativeMasteryRate: 0
            });
            const weekStart = new Date(date);
            const day = weekStart.getDay();
            const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
            weekStart.setDate(diff);
            const weekStartStr = weekStart.toISOString().split('T')[0];
            if (!weeklyProgress.has(weekStartStr)) {
                weeklyProgress.set(weekStartStr, {
                    newMasteries: 0,
                    totalMasteries: 0,
                    masteryRate: 0
                });
            }
        }
        let cumulativeMasteries = 0;
        for (const progress of progressUpdates) {
            const dateStr = progress.updatedAt.toISOString().split('T')[0];
            if (dailyProgress.has(dateStr)) {
                const dayData = dailyProgress.get(dateStr);
                dayData.newMasteries++;
                const date = new Date(dateStr);
                const day = date.getDay();
                const diff = date.getDate() - day + (day === 0 ? -6 : 1);
                const weekStart = new Date(date);
                weekStart.setDate(diff);
                const weekStartStr = weekStart.toISOString().split('T')[0];
                if (weeklyProgress.has(weekStartStr)) {
                    const weekData = weeklyProgress.get(weekStartStr);
                    weekData.newMasteries++;
                }
            }
        }
        const totalProgressCount = await this.studentVocabularyProgressModel.count();
        let dailyTotal = 0;
        const dailyProgressArray = Array.from(dailyProgress.entries()).map(([date, data]) => {
            dailyTotal += data.newMasteries;
            cumulativeMasteries += data.newMasteries;
            const cumulativeMasteryRate = totalProgressCount > 0 ?
                Math.round((cumulativeMasteries / totalProgressCount) * 100 * 10) / 10 : 0;
            return {
                date,
                newMasteries: data.newMasteries,
                totalMasteries: dailyTotal,
                cumulativeMasteryRate
            };
        });
        const weeklyProgressArray = Array.from(weeklyProgress.entries())
            .map(([weekStart, data]) => {
            const weekTotal = progressUpdates
                .filter(p => {
                const progressDate = new Date(p.updatedAt);
                const progressWeekStart = new Date(progressDate);
                const day = progressWeekStart.getDay();
                const diff = progressWeekStart.getDate() - day + (day === 0 ? -6 : 1);
                progressWeekStart.setDate(diff);
                return progressWeekStart.toISOString().split('T')[0] === weekStart;
            })
                .length;
            const weekMasteryRate = totalProgressCount > 0 ?
                Math.round((weekTotal / totalProgressCount) * 100 * 10) / 10 : 0;
            return {
                weekStart,
                newMasteries: data.newMasteries,
                totalMasteries: weekTotal,
                masteryRate: weekMasteryRate
            };
        })
            .filter(week => week.newMasteries > 0)
            .sort((a, b) => new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime());
        return {
            dailyProgress: dailyProgressArray,
            weeklyProgress: weeklyProgressArray
        };
    }
};
StudentVocabularyProgressService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentVocabularyProgress)),
    __metadata("design:paramtypes", [Object])
], StudentVocabularyProgressService);
export { StudentVocabularyProgressService };
//# sourceMappingURL=student-vocabulary-progress.service.js.map