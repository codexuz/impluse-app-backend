import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto.js';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto.js';
import { TeacherProfile } from './entities/teacher-profile.entity.js';

@Injectable()
export class TeacherProfileService {
  constructor(
    @InjectModel(TeacherProfile)
    private teacherProfileModel: typeof TeacherProfile,
  ) {}

  async create(createTeacherProfileDto: CreateTeacherProfileDto): Promise<TeacherProfile> {
    // Check if profile already exists for this user
    const existingProfile = await this.teacherProfileModel.findOne({
      where: { user_id: createTeacherProfileDto.user_id },
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this teacher');
    }

    return await this.teacherProfileModel.create(createTeacherProfileDto as any);
  }

  async findAll(): Promise<TeacherProfile[]> {
    return await this.teacherProfileModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUserId(userId: string): Promise<TeacherProfile> {
    const profile = await this.teacherProfileModel.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user with ID "${userId}" not found`);
    }

    return profile;
  }

  async findOne(id: string): Promise<TeacherProfile> {
    const profile = await this.teacherProfileModel.findByPk(id);

    if (!profile) {
      throw new NotFoundException(`Teacher profile with ID "${id}" not found`);
    }

    return profile;
  }

  async update(id: string, updateTeacherProfileDto: UpdateTeacherProfileDto): Promise<TeacherProfile> {
    const profile = await this.findOne(id);

    await profile.update(updateTeacherProfileDto as any);

    return profile;
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    
    await profile.destroy();
  }
}
