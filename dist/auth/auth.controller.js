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
import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, HttpStatus, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { Permissions } from './decorators/permissions.decorator.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PermissionsGuard } from './guards/permissions.guard.js';
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async studentLogin(loginDto, req, ip, userAgent) {
        return this.authService.login(loginDto, userAgent, ip, 'student');
    }
    async teacherLogin(loginDto, req, ip, userAgent) {
        return this.authService.login(loginDto, userAgent, ip, 'teacher');
    }
    async adminLogin(loginDto, req, ip, userAgent) {
        return this.authService.login(loginDto, userAgent, ip, 'admin');
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async logout(user) {
        await this.authService.logout(user.sessionId);
        return { message: 'Logged out successfully' };
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshAccessToken(refreshTokenDto);
    }
    getProfile(user) {
        return {
            user: {
                id: user.userId,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                roles: user.roles,
                permissions: user.permissions,
                sessionId: user.sessionId
            }
        };
    }
    async getSessions(user) {
        return this.authService.getUserSessions(user.userId);
    }
    adminOnly() {
        return { message: 'Admin access granted' };
    }
    usersRead() {
        return { message: 'Users read permission granted' };
    }
};
__decorate([
    Post('student/login'),
    ApiOperation({ summary: 'Student login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
        status: 200,
        description: 'Student login successful',
        schema: {
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        phone: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } }
                    }
                },
                sessionId: { type: 'string' }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Must be a student' }),
    __param(0, Body()),
    __param(1, Request()),
    __param(2, Ip()),
    __param(3, Headers('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "studentLogin", null);
__decorate([
    Post('teacher/login'),
    ApiOperation({ summary: 'Teacher login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
        status: 200,
        description: 'Teacher login successful',
        schema: {
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        phone: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } }
                    }
                },
                sessionId: { type: 'string' }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Must be a teacher' }),
    __param(0, Body()),
    __param(1, Request()),
    __param(2, Ip()),
    __param(3, Headers('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "teacherLogin", null);
__decorate([
    Post('admin/login'),
    ApiOperation({ summary: 'Admin login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
        status: 200,
        description: 'Admin login successful',
        schema: {
            properties: {
                access_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        phone: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } }
                    }
                },
                sessionId: { type: 'string' }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Must be an admin' }),
    __param(0, Body()),
    __param(1, Request()),
    __param(2, Ip()),
    __param(3, Headers('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminLogin", null);
__decorate([
    Post('register'),
    ApiOperation({ summary: 'Register new student account' }),
    ApiBody({ type: RegisterDto }),
    ApiResponse({
        status: 201,
        description: 'Registration successful',
        schema: {
            properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                phone: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } },
                student_profile: {
                    type: 'object',
                    properties: {
                        points: { type: 'number' },
                        coins: { type: 'number' },
                        streaks: { type: 'number' }
                    }
                }
            }
        }
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 409, description: 'User already exists' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Post('logout'),
    HttpCode(HttpStatus.OK),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Logout current user' }),
    ApiResponse({ status: 200, description: 'Logout successful' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    Post('refresh'),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'Refresh access token using refresh token' }),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({
        status: 200,
        description: 'Token refresh successful',
        schema: {
            properties: {
                access_token: { type: 'string' },
                refresh_token: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        phone: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } }
                    }
                },
                sessionId: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' },
                refreshExpiresAt: { type: 'string', format: 'date-time' }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Invalid refresh token or session' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('profile'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({
        status: 200,
        description: 'User profile retrieved successfully',
        schema: {
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        roles: { type: 'array', items: { type: 'string' } },
                        permissions: { type: 'array', items: { type: 'string' } },
                        sessionId: { type: 'string' }
                    }
                }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    UseGuards(JwtAuthGuard),
    Get('sessions'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user\'s active sessions' }),
    ApiResponse({
        status: 200,
        description: 'Sessions retrieved successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    sessionId: { type: 'string' },
                    userId: { type: 'string' },
                    userAgent: { type: 'string' },
                    ipAddress: { type: 'string' },
                    expiresAt: { type: 'string', format: 'date-time' },
                    isActive: { type: 'boolean' }
                }
            }
        }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSessions", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin'),
    Get('admin-only'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Admin only test endpoint' }),
    ApiResponse({ status: 200, description: 'Admin access granted' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Admin role required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "adminOnly", null);
__decorate([
    UseGuards(JwtAuthGuard, PermissionsGuard),
    Permissions('users:read'),
    Get('users-read'),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Users read permission test endpoint' }),
    ApiResponse({ status: 200, description: 'Users read permission granted' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden - Users read permission required' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "usersRead", null);
AuthController = __decorate([
    ApiTags('Authentication'),
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map