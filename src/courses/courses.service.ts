import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Unit } from "../units/entities/units.entity.js";
import { Course } from "./entities/course.entity.js";
import { CreateCourseDto } from "./dto/create-course.dto.js";
import { UpdateCourseDto } from "./dto/update-course.dto.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course)
    private courseModel: typeof Course,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(LessonProgress)
    private lessonProgressModel: typeof LessonProgress,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseModel.create({
      ...createCourseDto,
    });
  }

  async findAll(
    page?: number,
    limit?: number,
    status?: boolean,
    search?: string,
    level?: string,
  ): Promise<{
    data: Course[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  }> {
    const where: any = {};

    // Filter by status if provided, otherwise show all
    if (status !== undefined) {
      where.isActive = status;
    }

    // Filter by level if provided
    if (level) {
      where.level = level;
    }

    // Search functionality
    if (search) {
      where.title = {
        [Op.like]: `%${search}%`,
      };
    }

    const options: any = {
      where,
      include: [
        {
          model: Unit,
          as: "units",
          separate: true,
          order: [["order", "ASC"]],
          include: ["lessons"],
        },
      ],
    };

    // Only apply pagination if both page and limit are provided
    if (page !== undefined && limit !== undefined) {
      const offset = (page - 1) * limit;
      options.limit = limit;
      options.offset = offset;
    }

    const { count, rows } = await this.courseModel.findAndCountAll(options);

    const result: any = {
      data: rows,
      total: count,
    };

    // Include pagination details only if pagination was applied
    if (page !== undefined && limit !== undefined) {
      result.page = page;
      result.limit = limit;
      result.totalPages = Math.ceil(count / limit);
    }

    return result;
  }

  async getCourseProgress(student_id: string) {
    // First find the user to get their level_id (course_id)
    const user = await this.userModel.findByPk(student_id);

    if (!user) throw new NotFoundException("User not found");
    if (!user.level_id)
      throw new NotFoundException("User is not assigned to any course");

    // Get the course using the user's level_id
    const course = (await this.courseModel.findByPk(user.level_id, {
      include: [
        {
          model: Unit,
          as: "units",
          include: ["lessons"],
        },
      ],
    })) as Course & { units: (Unit & { lessons: Lesson[] })[] };

    if (!course) throw new NotFoundException("Course not found");

    const allLessons = course.units.flatMap((unit) => unit.lessons);
    const completedLessonIds = await this.lessonProgressModel.findAll({
      where: {
        student_id,
        lesson_id: allLessons.map((l) => l.id),
      },
      attributes: ["lesson_id"],
    });

    const completedCount = completedLessonIds.length;
    const total = allLessons.length;

    return {
      course_id: user.level_id,
      course_name: course.title,
      completed: completedCount,
      total,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    };
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: Unit,
          as: "units",
          separate: true,
          order: [["order", "ASC"]],
          include: ["lessons"],
        },
      ],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    await course.update(updateCourseDto);
    return course;
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.update({ isActive: false }); // Soft delete
  }

  async hardRemove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await course.destroy();
  }
}
