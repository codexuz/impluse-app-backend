import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from './entities/role.model.js';
import { StudentProfile } from '../student_profiles/entities/student_profile.entity.js';
import { UserSession } from './entities/user-session.model.js';
import { StudentPayment } from '../student-payment/entities/student-payment.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile
  ) {}

  private async checkExistingUser(username: string, phone: string): Promise<void> {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { username },
          { phone },
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createTeacher(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    await this.checkExistingUser(createUserDto.username, createUserDto.phone);

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Create user
    const user = await this.userModel.create({
      ...createUserDto,
      password_hash: hashedPassword,
      is_active: true
    });

    // Assign teacher role
    const teacherRole = await this.roleModel.findOne({ where: { name: 'teacher' } });
    if (teacherRole) {
      await user.$add('roles', teacherRole);
    }

    // Return user with profile included
    return this.findOne(user.user_id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ]
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        },
        {
          model: StudentProfile,
          as: 'student_profile'
        },
        {
          model: UserSession,
          as: 'sessions',
          attributes: ['id', 'isActive', 'createdAt', 'updatedAt']
        },
        {
          model: StudentPayment,
          as: 'payments'
        }
      ]
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        },
        {
          model: StudentProfile,
          as: 'student_profile'
        }
      ]
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If updating password, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    await user.update(updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    await user.update({ is_active: false });
    return user;
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    await user.update({ is_active: true });
    return user;
  }

  async getAllTeachers(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          where: { name: 'teacher' },
          through: { attributes: [] }
        }
      ]
    });
  }

  async getAllStudents(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          where: { name: 'student' },
          through: { attributes: [] }
        },
        {
          model: StudentProfile,
          as: 'student_profile'
        }
      ]
    });
  }

  async getAllSupportTeachers(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ['password_hash']
      },
      include: [
        {
          model: Role,
          as: 'roles',
          where: { name: 'support_teacher' },
          through: { attributes: [] }
        }
      ]
    });
  }
}
