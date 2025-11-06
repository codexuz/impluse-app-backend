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
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/entities/role.model.js';
import { UserSession } from '../users/entities/user-session.model.js';
import { StudentWallet } from '../student-wallet/entities/student-wallet.entity.js';
import * as bcrypt from 'bcrypt';
let AuthService = class AuthService {
    constructor(userModel, userSessionModel, studentWalletModel, jwtService) {
        this.userModel = userModel;
        this.userSessionModel = userSessionModel;
        this.studentWalletModel = studentWalletModel;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        const user = await this.userModel.findOne({
            where: {
                username,
                is_active: true
            },
            include: [
                {
                    model: Role,
                    as: 'roles',
                    include: ['permissions']
                }
            ]
        });
        if (!user) {
            return null;
        }
        try {
            const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
            if (!isPasswordValid) {
                return null;
            }
            return user;
        }
        catch (error) {
            console.error('Password comparison error:', error);
            return null;
        }
    }
    async login(loginDto, userAgent, ipAddress, requiredRole) {
        console.log('Login attempt for username:', loginDto.username);
        console.log('Required role:', requiredRole);
        const user = await this.userModel.findOne({
            where: {
                username: loginDto.username,
                is_active: true
            },
            include: [
                {
                    model: Role,
                    as: 'roles',
                    include: ['permissions']
                }
            ]
        });
        if (!user) {
            console.log('User not found or inactive:', loginDto.username);
            throw new UnauthorizedException('Invalid username or password');
        }
        console.log('User found:', user.username);
        console.log('User roles:', user.roles?.map(role => role.name));
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!isPasswordValid) {
            console.log('Password validation failed for user:', loginDto.username);
            throw new UnauthorizedException('Invalid username or password');
        }
        console.log('Password validation successful for user:', loginDto.username);
        if (requiredRole) {
            const userRoles = user.roles.map(role => role.name.toLowerCase());
            console.log('User roles (lowercase):', userRoles);
            console.log('Required role (lowercase):', requiredRole.toLowerCase());
            if (!userRoles.includes(requiredRole.toLowerCase())) {
                console.log(`Access denied. User ${loginDto.username} is not a ${requiredRole}`);
                throw new UnauthorizedException(`Access denied. User is not a ${requiredRole}`);
            }
        }
        console.log('Role validation successful for user:', loginDto.username);
        await this.limitUserSessions(user.user_id, 2);
        const sessionId = uuidv4();
        const roles = user.roles.map(role => role.name);
        const permissions = user.roles.reduce((acc, role) => {
            const rolePermissions = role.permissions.map(p => `${p.resource}:${p.action}`);
            return [...acc, ...rolePermissions];
        }, []);
        const payload = {
            sub: user.user_id,
            username: user.username,
            phone: user.phone,
            sessionId,
            roles,
            permissions
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        const decodedToken = this.jwtService.decode(accessToken);
        const expiresAt = new Date(decodedToken.exp * 1000);
        const refreshToken = this.generateRefreshToken();
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 60);
        await this.userSessionModel.create({
            id: sessionId,
            userId: user.user_id,
            jwtToken: accessToken,
            userAgent,
            ipAddress,
            expiresAt,
            isActive: true,
            lastAccessedAt: new Date(),
            refreshToken,
            refreshTokenExpiresAt: refreshExpiresAt
        });
        await user.update({
            currentSessionId: sessionId,
            last_login: new Date()
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.user_id,
                username: user.username,
                phone: user.phone,
                first_name: user.first_name,
                last_name: user.last_name,
                roles
            },
            sessionId,
            expiresAt,
            refreshExpiresAt
        };
    }
    async register(registerDto) {
        const existingUser = await this.userModel.findOne({
            where: {
                [Op.or]: [
                    { phone: registerDto.phone },
                    { username: registerDto.username }
                ]
            }
        });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
            const { password, ...userDataWithoutPassword } = registerDto;
            const user = await this.userModel.create({
                ...userDataWithoutPassword,
                password_hash: hashedPassword,
                is_active: true
            });
            const studentRole = await Role.findOne({ where: { name: 'student' } });
            if (studentRole) {
                await user.$add('roles', studentRole);
            }
            await this.userModel.sequelize.models.StudentProfile.create({
                user_id: user.user_id,
                points: 0,
                coins: 0,
                streaks: 0
            });
            await this.studentWalletModel.create({
                student_id: user.user_id,
                amount: 0
            });
            return this.userModel.findByPk(user.user_id, {
                include: [
                    {
                        model: Role,
                        as: 'roles',
                        through: { attributes: [] }
                    },
                    {
                        model: this.userModel.sequelize.models.StudentProfile,
                        as: 'student_profile'
                    }
                ]
            });
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
    async logout(sessionId) {
        await this.userSessionModel.update({ isActive: false }, { where: { id: sessionId } });
        await this.userModel.update({ currentSessionId: null }, { where: { currentSessionId: sessionId } });
    }
    async validateSession(sessionId, userId) {
        const session = await this.userSessionModel.findOne({
            where: {
                id: sessionId,
                userId,
                isActive: true,
                expiresAt: { [Op.gt]: new Date() }
            }
        });
        if (!session) {
            return false;
        }
        await session.update({ lastAccessedAt: new Date() });
        return true;
    }
    async limitUserSessions(userId, maxSessions = 2) {
        const activeSessions = await this.userSessionModel.findAll({
            where: {
                userId,
                isActive: true,
                expiresAt: { [Op.gt]: new Date() }
            },
            order: [['lastAccessedAt', 'ASC']]
        });
        if (activeSessions.length >= maxSessions) {
            const sessionsToDeactivate = activeSessions.slice(0, activeSessions.length - maxSessions + 1);
            for (const session of sessionsToDeactivate) {
                await session.update({ isActive: false });
            }
            const deactivatedSessionIds = sessionsToDeactivate.map(s => s.id);
            const user = await this.userModel.findByPk(userId);
            if (user && deactivatedSessionIds.includes(user.currentSessionId)) {
                await user.update({ currentSessionId: null });
            }
        }
    }
    async terminateUserSessions(userId) {
        await this.userSessionModel.update({ isActive: false }, { where: { userId, isActive: true } });
        await this.userModel.update({ currentSessionId: null }, { where: { user_id: userId } });
    }
    async getUserSessions(userId) {
        const sessions = await this.userSessionModel.findAll({
            where: { userId, isActive: true },
            attributes: ['id', 'userId', 'userAgent', 'ipAddress', 'expiresAt', 'isActive'],
            order: [['createdAt', 'DESC']]
        });
        return sessions.map(session => ({
            sessionId: session.id,
            userId: session.userId,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            expiresAt: session.expiresAt,
            isActive: session.isActive
        }));
    }
    async getActiveSessionCount(userId) {
        return await this.userSessionModel.count({
            where: {
                userId,
                isActive: true,
                expiresAt: { [Op.gt]: new Date() }
            }
        });
    }
    async cleanupExpiredSessions() {
        await this.userSessionModel.update({ isActive: false }, { where: { expiresAt: { [Op.lt]: new Date() } } });
    }
    generateRefreshToken() {
        const timestamp = new Date().getTime().toString();
        const randomStr = uuidv4();
        const baseString = `${timestamp}.${randomStr}`;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(baseString, salt);
        return hash.replace(/[/+=]/g, '')
            .substring(7, 64);
    }
    async refreshAccessToken(refreshTokenDto) {
        const { refreshToken, sessionId } = refreshTokenDto;
        const session = await this.userSessionModel.findOne({
            where: {
                id: sessionId,
                refreshToken,
                isActive: true,
                refreshTokenExpiresAt: { [Op.gt]: new Date() }
            }
        });
        if (!session) {
            throw new UnauthorizedException('Invalid refresh token or session');
        }
        const user = await this.userModel.findByPk(session.userId, {
            include: [
                {
                    model: Role,
                    as: 'roles',
                    include: ['permissions']
                }
            ]
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const roles = user.roles.map(role => role.name);
        const permissions = user.roles.reduce((acc, role) => {
            const rolePermissions = role.permissions.map(p => `${p.resource}:${p.action}`);
            return [...acc, ...rolePermissions];
        }, []);
        const payload = {
            sub: user.user_id,
            username: user.username,
            phone: user.phone,
            sessionId: session.id,
            roles,
            permissions
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const decodedToken = this.jwtService.decode(accessToken);
        const expiresAt = new Date(decodedToken.exp * 1000);
        const newRefreshToken = this.generateRefreshToken();
        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30);
        await session.update({
            jwtToken: accessToken,
            refreshToken: newRefreshToken,
            expiresAt,
            refreshTokenExpiresAt: refreshExpiresAt,
            lastAccessedAt: new Date()
        });
        return {
            access_token: accessToken,
            refresh_token: newRefreshToken,
            user: {
                id: user.user_id,
                username: user.username,
                phone: user.phone,
                first_name: user.first_name,
                last_name: user.last_name,
                roles
            },
            sessionId: session.id,
            expiresAt,
            refreshExpiresAt
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __param(1, InjectModel(UserSession)),
    __param(2, InjectModel(StudentWallet)),
    __metadata("design:paramtypes", [Object, Object, Object, JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map