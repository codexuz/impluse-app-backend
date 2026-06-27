import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserCourseDto } from './dto/create-user-course.dto.js';
import { UpdateUserCourseDto } from './dto/update-user-course.dto.js';
import { UserCourse } from './entities/user-course.entity.js';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectModel(UserCourse)
    private userCourseModel: typeof UserCourse,
  ) {}

  async create(createUserCourseDto: CreateUserCourseDto): Promise<UserCourse> {
    return this.userCourseModel.create({
      ...createUserCourseDto,
    });
  }

  /**
   * Idempotently enroll a student in a course. Used to auto-assign a student's
   * course whenever their level/group is set. Best-effort: a missing courseId is
   * skipped and any failure is swallowed so it never breaks the caller's main
   * operation (group enrollment, user update, registration).
   */
  async enrollIfNeeded(
    userId: string,
    courseId?: string | null,
  ): Promise<UserCourse | null> {
    if (!userId || !courseId) return null;

    try {
      const [userCourse] = await this.userCourseModel.findOrCreate({
        where: { userId, courseId },
        defaults: { userId, courseId } as any,
      });
      return userCourse;
    } catch (err) {
      console.error(
        `Failed to auto-enroll user ${userId} in course ${courseId}`,
        err,
      );
      return null;
    }
  }

  async findAll(): Promise<UserCourse[]> {
    return this.userCourseModel.findAll();
  }

  async findAllByUserId(userId: string): Promise<UserCourse[]> {
    return this.userCourseModel.findAll({
      where: {
        userId,
      },
    });
  }

  async findAllByCourseId(courseId: string): Promise<UserCourse[]> {
    return this.userCourseModel.findAll({
      where: {
        courseId,
      },
    });
  }

  async findOne(id: string): Promise<UserCourse> {
    const userCourse = await this.userCourseModel.findByPk(id);
    if (!userCourse) {
      throw new NotFoundException(`User course with ID "${id}" not found`);
    }
    return userCourse;
  }

  async update(id: string, updateUserCourseDto: UpdateUserCourseDto): Promise<UserCourse> {
    const userCourse = await this.findOne(id);
    
    if (updateUserCourseDto.isCompleted && !userCourse.isCompleted) {
      updateUserCourseDto.completedAt = new Date();
    }
    
    await userCourse.update(updateUserCourseDto);
    return userCourse;
  }

  async remove(id: string): Promise<void> {
    const userCourse = await this.findOne(id);
    await userCourse.destroy();
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<UserCourse> {
    const userCourse = await this.userCourseModel.findOne({
      where: {
        userId,
        courseId,
      },
    });
    
    if (!userCourse) {
      throw new NotFoundException(`User course not found for user ${userId} and course ${courseId}`);
    }
    
    return userCourse;
  }
}
