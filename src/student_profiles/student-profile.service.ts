import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentProfile } from './entities/student_profile.entity.js';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto.js';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto.js';

@Injectable()
export class StudentProfileService {
  constructor(
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile,
  ) {}

  async create(createStudentProfileDto: CreateStudentProfileDto): Promise<StudentProfile> {
    return this.studentProfileModel.create({ ...createStudentProfileDto });
  }

  async findAll(): Promise<StudentProfile[]> {
    return this.studentProfileModel.findAll();
  }

  async findOne(id: string): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findByPk(id);
    if (!profile) {
      throw new NotFoundException(`Student profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByUserId(userId: string): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: userId }
    });
    if (!profile) {
      throw new NotFoundException(`Student profile for user ${userId} not found`);
    }
    return profile;
  }

  async update(id: string, updateStudentProfileDto: UpdateStudentProfileDto): Promise<StudentProfile> {
    const profile = await this.findOne(id);
    await profile.update(updateStudentProfileDto);
    return profile;
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await profile.destroy();
  }

  async addPoints(userId: string, points: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment('points', { by: points });
    return profile.reload();
  }

  async addCoins(userId: string, coins: number): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment('coins', { by: coins });
    return profile.reload();
  }

  async incrementStreak(userId: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    await profile.increment('streaks');
    return profile.reload();
  }

  async resetStreak(userId: string): Promise<StudentProfile> {
    const profile = await this.findByUserId(userId);
    profile.streaks = 0;
    await profile.save();
    return profile;
  }
}
