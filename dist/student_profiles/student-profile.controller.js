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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, } from '@nestjs/common';
import { StudentProfileService } from './student-profile.service.js';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto.js';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto.js';
import { LeaderboardItemDto, UserRankingResponseDto } from './dto/leaderboard-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery, } from '@nestjs/swagger';
let StudentProfileController = class StudentProfileController {
    constructor(studentProfileService) {
        this.studentProfileService = studentProfileService;
    }
    create(createStudentProfileDto) {
        return this.studentProfileService.create(createStudentProfileDto);
    }
    findAll() {
        return this.studentProfileService.findAll();
    }
    findOne(id) {
        return this.studentProfileService.findOne(id);
    }
    findByUserId(userId) {
        return this.studentProfileService.findByUserId(userId);
    }
    update(id, updateStudentProfileDto) {
        return this.studentProfileService.update(id, updateStudentProfileDto);
    }
    remove(id) {
        return this.studentProfileService.remove(id);
    }
    addPoints(id, amount) {
        return this.studentProfileService.addPoints(id, amount);
    }
    addCoins(id, amount) {
        return this.studentProfileService.addCoins(id, amount);
    }
    incrementStreak(id) {
        return this.studentProfileService.incrementStreak(id);
    }
    resetStreak(id) {
        return this.studentProfileService.resetStreak(id);
    }
    getLeaderboardByCoins(limit) {
        const numericLimit = limit ? parseInt(limit, 10) : undefined;
        const validLimit = numericLimit && !isNaN(numericLimit) && numericLimit > 0 ? numericLimit : undefined;
        return this.studentProfileService.getLeaderboardByCoins(validLimit);
    }
    getLeaderboardByPoints(limit) {
        const numericLimit = limit ? parseInt(limit, 10) : undefined;
        const validLimit = numericLimit && !isNaN(numericLimit) && numericLimit > 0 ? numericLimit : undefined;
        return this.studentProfileService.getLeaderboardByPoints(validLimit);
    }
    getLeaderboardByStreaks(limit) {
        const numericLimit = limit ? parseInt(limit, 10) : undefined;
        const validLimit = numericLimit && !isNaN(numericLimit) && numericLimit > 0 ? numericLimit : undefined;
        return this.studentProfileService.getLeaderboardByStreaks(validLimit);
    }
    getOverallLeaderboard(limit) {
        const numericLimit = limit ? parseInt(limit, 10) : undefined;
        const validLimit = numericLimit && !isNaN(numericLimit) && numericLimit > 0 ? numericLimit : undefined;
        return this.studentProfileService.getOverallLeaderboard(validLimit);
    }
    getUserRankingByCoins(userId) {
        return this.studentProfileService.getUserRankingByCoins(userId);
    }
    getUserRankingByPoints(userId) {
        return this.studentProfileService.getUserRankingByPoints(userId);
    }
    getUserRankingByStreaks(userId) {
        return this.studentProfileService.getUserRankingByStreaks(userId);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary: 'Create a new student profile' }),
    ApiResponse({ status: 201, description: 'Profile created successfully' }),
    ApiBody({ type: CreateStudentProfileDto }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentProfileDto]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all student profiles' }),
    ApiResponse({ status: 200, description: 'Return all student profiles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get student profile by id' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiResponse({ status: 200, description: 'Return the student profile' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "findOne", null);
__decorate([
    Get('user/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get student profile by user id' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Return the student profile' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "findByUserId", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update student profile' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiBody({ type: UpdateStudentProfileDto }),
    ApiResponse({ status: 200, description: 'Profile updated successfully' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentProfileDto]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete student profile' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiResponse({ status: 204, description: 'Profile deleted successfully' }),
    ApiResponse({ status: 404, description: 'Profile not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "remove", null);
__decorate([
    Patch(':id/points/add/:amount'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Add points to student profile' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiParam({ name: 'amount', description: 'Amount of points to add' }),
    ApiResponse({ status: 200, description: 'Points added successfully' }),
    __param(0, Param('id')),
    __param(1, Param('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "addPoints", null);
__decorate([
    Patch(':id/coins/add/:amount'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Add coins to student profile' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiParam({ name: 'amount', description: 'Amount of coins to add' }),
    ApiResponse({ status: 200, description: 'Coins added successfully' }),
    __param(0, Param('id')),
    __param(1, Param('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "addCoins", null);
__decorate([
    Patch(':id/streak/increment'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Increment student streak' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiResponse({ status: 200, description: 'Streak incremented successfully' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "incrementStreak", null);
__decorate([
    Patch(':id/streak/reset'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Reset student streak' }),
    ApiParam({ name: 'id', description: 'Student Profile ID' }),
    ApiResponse({ status: 200, description: 'Streak reset successfully' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "resetStreak", null);
__decorate([
    Get('leaderboard/coins'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get leaderboard ranked by coins' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results to return (default: 10)' }),
    ApiResponse({ status: 200, description: 'Return leaderboard by coins', type: [LeaderboardItemDto] }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getLeaderboardByCoins", null);
__decorate([
    Get('leaderboard/points'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get leaderboard ranked by points' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results to return (default: 10)' }),
    ApiResponse({ status: 200, description: 'Return leaderboard by points', type: [LeaderboardItemDto] }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getLeaderboardByPoints", null);
__decorate([
    Get('leaderboard/streaks'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get leaderboard ranked by streaks' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results to return (default: 10)' }),
    ApiResponse({ status: 200, description: 'Return leaderboard by streaks', type: [LeaderboardItemDto] }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getLeaderboardByStreaks", null);
__decorate([
    Get('leaderboard/overall'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get overall leaderboard' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results to return (default: 10)' }),
    ApiResponse({ status: 200, description: 'Return overall leaderboard', type: [LeaderboardItemDto] }),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getOverallLeaderboard", null);
__decorate([
    Get('ranking/coins/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get user ranking by coins' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Return user ranking by coins', type: UserRankingResponseDto }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getUserRankingByCoins", null);
__decorate([
    Get('ranking/points/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get user ranking by points' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Return user ranking by points', type: UserRankingResponseDto }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getUserRankingByPoints", null);
__decorate([
    Get('ranking/streaks/:userId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get user ranking by streaks' }),
    ApiParam({ name: 'userId', description: 'User ID' }),
    ApiResponse({ status: 200, description: 'Return user ranking by streaks', type: UserRankingResponseDto }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentProfileController.prototype, "getUserRankingByStreaks", null);
StudentProfileController = __decorate([
    ApiTags('Student Profiles'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('student-profiles'),
    __metadata("design:paramtypes", [StudentProfileService])
], StudentProfileController);
export { StudentProfileController };
//# sourceMappingURL=student-profile.controller.js.map