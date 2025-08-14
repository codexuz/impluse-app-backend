export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    phone: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
}
export declare class JwtPayload {
    sub: string;
    username: string;
    phone: string;
    sessionId: string;
    roles: string[];
    permissions: string[];
    iat?: number;
    exp?: number;
}
