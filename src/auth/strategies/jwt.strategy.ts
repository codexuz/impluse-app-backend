import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/auth.dto.js';
import { AuthService } from '../auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: JwtPayload) {
    const isValidSession = await this.authService.validateSession(
      payload.sessionId,
      payload.sub
    );
    
    if (!isValidSession) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      phone: payload.phone,
      sessionId: payload.sessionId,
      roles: payload.roles,
      permissions: payload.permissions
    };
  }
}