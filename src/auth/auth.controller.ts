import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Headers
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiHeader 
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { Permissions } from './decorators/permissions.decorator.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PermissionsGuard } from './guards/permissions.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('student/login')
  @ApiOperation({ summary: 'Student login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Must be a student' })
  async studentLogin(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    return this.authService.login(loginDto, userAgent, ip, 'student');
  }

  @Post('teacher/login')
  @ApiOperation({ summary: 'Teacher login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Must be a teacher' })
  async teacherLogin(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    return this.authService.login(loginDto, userAgent, ip, 'teacher');
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Must be an admin' })
  async adminLogin(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    return this.authService.login(loginDto, userAgent, ip, 'admin');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new student account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@CurrentUser() user: any) {
    await this.authService.logout(user.sessionId);
    return { message: 'Logged out successfully' };
  }
  
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token or session' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: any) {
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

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s active sessions' })
  @ApiResponse({ 
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSessions(@CurrentUser() user: any) {
    return this.authService.getUserSessions(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin only test endpoint' })
  @ApiResponse({ status: 200, description: 'Admin access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  adminOnly() {
    return { message: 'Admin access granted' };
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('users:read')
  @Get('users-read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Users read permission test endpoint' })
  @ApiResponse({ status: 200, description: 'Users read permission granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Users read permission required' })
  usersRead() {
    return { message: 'Users read permission granted' };
  }
}