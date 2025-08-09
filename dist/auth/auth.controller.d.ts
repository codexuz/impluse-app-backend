import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    studentLogin(loginDto: LoginDto, req: any, ip: string, userAgent?: string): Promise<import("./interfaces/auth.interface.js").AuthResponse>;
    teacherLogin(loginDto: LoginDto, req: any, ip: string, userAgent?: string): Promise<import("./interfaces/auth.interface.js").AuthResponse>;
    adminLogin(loginDto: LoginDto, req: any, ip: string, userAgent?: string): Promise<import("./interfaces/auth.interface.js").AuthResponse>;
    register(registerDto: RegisterDto): Promise<import("../users/entities/user.entity.js").User>;
    logout(user: any): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<import("./interfaces/auth.interface.js").AuthResponse>;
    getProfile(user: any): {
        user: {
            id: any;
            username: any;
            first_name: any;
            last_name: any;
            phone: any;
            roles: any;
            permissions: any;
            sessionId: any;
        };
    };
    getSessions(user: any): Promise<import("./interfaces/auth.interface.js").SessionInfo[]>;
    adminOnly(): {
        message: string;
    };
    usersRead(): {
        message: string;
    };
}
