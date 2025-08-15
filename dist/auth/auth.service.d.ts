import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { AuthResponse, SessionInfo } from './interfaces/auth.interface.js';
import { User } from '../users/entities/user.entity.js';
import { UserSession } from '../users/entities/user-session.model.js';
export declare class AuthService {
    private userModel;
    private userSessionModel;
    private jwtService;
    constructor(userModel: typeof User, userSessionModel: typeof UserSession, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<User | null>;
    login(loginDto: LoginDto, userAgent?: string, ipAddress?: string, requiredRole?: 'student' | 'teacher' | 'admin'): Promise<AuthResponse>;
    register(registerDto: RegisterDto): Promise<User>;
    logout(sessionId: string): Promise<void>;
    validateSession(sessionId: string, userId: string): Promise<boolean>;
    terminateUserSessions(userId: string): Promise<void>;
    getUserSessions(userId: string): Promise<SessionInfo[]>;
    cleanupExpiredSessions(): Promise<void>;
    private generateRefreshToken;
    refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse>;
}
