import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { LoginDto, RegisterDto, JwtPayload } from './dto/auth.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { AuthResponse, SessionInfo } from './interfaces/auth.interface.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/entities/role.model.js';
import { UserSession } from '../users/entities/user-session.model.js';
import { StudentWallet } from '../student-wallet/entities/student-wallet.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserSession)
    private userSessionModel: typeof UserSession,
    @InjectModel(StudentWallet)
    private studentWalletModel: typeof StudentWallet,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
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
    } catch (error) {
      console.error('Password comparison error:', error);
      return null;
    }
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
    requiredRole?: 'student' | 'teacher' | 'admin'
  ): Promise<AuthResponse> {
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

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      console.log('Password validation failed for user:', loginDto.username);
      throw new UnauthorizedException('Invalid username or password');
    }
    
    console.log('Password validation successful for user:', loginDto.username);

    // Check if user has the required role
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

    // Terminate existing sessions for single-login enforcement
    await this.terminateUserSessions(user.user_id);
    
    // Create new session
    const sessionId = uuidv4();
    const roles = user.roles.map(role => role.name);
    const permissions = user.roles.reduce((acc, role) => {
      const rolePermissions = role.permissions.map(p => `${p.resource}:${p.action}`);
      return [...acc, ...rolePermissions];
    }, []);

    const payload: JwtPayload = {
      sub: user.user_id,
      username: user.username,
      phone: user.phone,
      sessionId,
      roles,
      permissions
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    const decodedToken = this.jwtService.decode(accessToken) as any;
    const expiresAt = new Date(decodedToken.exp * 1000);

    // Generate refresh token (valid for 30 days)
    const refreshToken = this.generateRefreshToken();
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 60);

    // Save session to database
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

    // Update user's current session
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

  async register(registerDto: RegisterDto): Promise<User> {
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
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Create user with hashed password
      const { password, ...userDataWithoutPassword } = registerDto;
      const user = await this.userModel.create({
        ...userDataWithoutPassword,
        password_hash: hashedPassword,
        is_active: true
      });

      // Assign student role
      const studentRole = await Role.findOne({ where: { name: 'student' } });
      if (studentRole) {
        await user.$add('roles', studentRole);
      }

      // Create student profile
      await this.userModel.sequelize.models.StudentProfile.create({
        user_id: user.user_id,
        points: 0,
        coins: 0,
        streaks: 0
      });

      // Create student wallet with initial balance of 0
      await this.studentWalletModel.create({
        student_id: user.user_id,
        amount: 0
      });

      // Return user with roles and profile included
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
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async logout(sessionId: string): Promise<void> {
    await this.userSessionModel.update(
      { isActive: false },
      { where: { id: sessionId } }
    );

    // Clear user's current session if it matches
    await this.userModel.update(
      { currentSessionId: null },
      { where: { currentSessionId: sessionId } }
    );
  }

  async validateSession(sessionId: string, userId: string): Promise<boolean> {
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

    // Update last accessed time
    await session.update({ lastAccessedAt: new Date() });
    return true;
  }

  async terminateUserSessions(userId: string): Promise<void> {
    await this.userSessionModel.update(
      { isActive: false },
      { where: { userId, isActive: true } }
    );

    await this.userModel.update(
      { currentSessionId: null },
      { where: { user_id: userId } }
    );
  }

  async getUserSessions(userId: string): Promise<SessionInfo[]> {
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

  async cleanupExpiredSessions(): Promise<void> {
    await this.userSessionModel.update(
      { isActive: false },
      { where: { expiresAt: { [Op.lt]: new Date() } } }
    );
  }

  private generateRefreshToken(): string {
    // Generate a unique string based on current timestamp and a random UUID
    const timestamp = new Date().getTime().toString();
    const randomStr = uuidv4();
    const baseString = `${timestamp}.${randomStr}`;
    
    // Hash the string using bcrypt (will be used as refresh token)
    // We're using sync version here as this is only called during auth operations
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(baseString, salt);
    
    // Return a URL-safe token without the bcrypt format markers
    return hash.replace(/[/+=]/g, '')
      .substring(7, 64); // Remove bcrypt format markers and limit length
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const { refreshToken, sessionId } = refreshTokenDto;
    
    // Find the session with the given refresh token and session ID
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

    // Get the user associated with this session
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

    // Generate new tokens
    const roles = user.roles.map(role => role.name);
    const permissions = user.roles.reduce((acc, role) => {
      const rolePermissions = role.permissions.map(p => `${p.resource}:${p.action}`);
      return [...acc, ...rolePermissions];
    }, []);

    const payload: JwtPayload = {
      sub: user.user_id,
      username: user.username,
      phone: user.phone,
      sessionId: session.id,
      roles,
      permissions
    };

    // Generate new access token
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const decodedToken = this.jwtService.decode(accessToken) as any;
    const expiresAt = new Date(decodedToken.exp * 1000);

    // Generate new refresh token
    const newRefreshToken = this.generateRefreshToken();
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30);

    // Update session with new tokens
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
}
