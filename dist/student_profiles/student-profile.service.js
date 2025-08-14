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
import { StudentProfile } from './entities/student_profile.entity.js';
let StudentProfileService = class StudentProfileService {
    constructor(studentProfileModel) {
        this.studentProfileModel = studentProfileModel;
    }
    async create(createStudentProfileDto) {
        return this.studentProfileModel.create({ ...createStudentProfileDto });
    }
    async findAll() {
        return this.studentProfileModel.findAll();
    }
    async findOne(id) {
        const profile = await this.studentProfileModel.findByPk(id);
        if (!profile) {
            throw new NotFoundException(`Student profile with ID ${id} not found`);
        }
        return profile;
    }
    async findByUserId(userId) {
        const profile = await this.studentProfileModel.findOne({
            where: { user_id: userId }
        });
        if (!profile) {
            throw new NotFoundException(`Student profile for user ${userId} not found`);
        }
        return profile;
    }
    async update(id, updateStudentProfileDto) {
        const profile = await this.findOne(id);
        await profile.update(updateStudentProfileDto);
        return profile;
    }
    async remove(id) {
        const profile = await this.findOne(id);
        await profile.destroy();
    }
    async addPoints(userId, points) {
        const profile = await this.findByUserId(userId);
        await profile.increment('points', { by: points });
        return profile.reload();
    }
    async addCoins(userId, coins) {
        const profile = await this.findByUserId(userId);
        await profile.increment('coins', { by: coins });
        return profile.reload();
    }
    async incrementStreak(userId) {
        const profile = await this.findByUserId(userId);
        await profile.increment('streaks');
        return profile.reload();
    }
    async resetStreak(userId) {
        const profile = await this.findByUserId(userId);
        profile.streaks = 0;
        await profile.save();
        return profile;
    }
    async getLeaderboardByCoins(limit) {
        const validLimit = limit && limit > 0 ? limit : 10;
        return this.studentProfileModel.findAll({
            order: [['coins', 'DESC']],
            limit: validLimit,
            include: [
                {
                    association: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'username']
                }
            ]
        });
    }
    async getLeaderboardByPoints(limit) {
        const validLimit = limit && limit > 0 ? limit : 10;
        return this.studentProfileModel.findAll({
            order: [['points', 'DESC']],
            limit: validLimit,
            include: [
                {
                    association: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'username']
                }
            ]
        });
    }
    async getLeaderboardByStreaks(limit) {
        const validLimit = limit && limit > 0 ? limit : 10;
        return this.studentProfileModel.findAll({
            order: [['streaks', 'DESC']],
            limit: validLimit,
            include: [
                {
                    association: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'username']
                }
            ]
        });
    }
    async getOverallLeaderboard(limit) {
        const validLimit = limit && limit > 0 ? limit : 10;
        return this.studentProfileModel.findAll({
            order: [
                ['points', 'DESC'],
                ['coins', 'DESC'],
                ['streaks', 'DESC']
            ],
            limit: validLimit,
            include: [
                {
                    association: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'username']
                }
            ]
        });
    }
    async getUserRankingByCoins(userId) {
        const profile = await this.findByUserId(userId);
        const higherRanked = await this.studentProfileModel.count({
            where: {
                coins: {
                    [Op.gt]: profile.coins
                }
            }
        });
        return {
            rank: higherRanked + 1,
            profile
        };
    }
    async getUserRankingByPoints(userId) {
        const profile = await this.findByUserId(userId);
        const higherRanked = await this.studentProfileModel.count({
            where: {
                points: {
                    [Op.gt]: profile.points
                }
            }
        });
        return {
            rank: higherRanked + 1,
            profile
        };
    }
    async getUserRankingByStreaks(userId) {
        const profile = await this.findByUserId(userId);
        const higherRanked = await this.studentProfileModel.count({
            where: {
                streaks: {
                    [Op.gt]: profile.streaks
                }
            }
        });
        return {
            rank: higherRanked + 1,
            profile
        };
    }
};
StudentProfileService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentProfile)),
    __metadata("design:paramtypes", [Object])
], StudentProfileService);
export { StudentProfileService };
//# sourceMappingURL=student-profile.service.js.map