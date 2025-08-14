import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
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

  async findAll(): Promise<Course[]> {
    return await this.courseModel.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: Unit,
          as: 'units',
          separate: true,
          order: [['order', 'ASC']],
        },
      ],
    });
  }

  async getCourseProgress(student_id: string) {
    // First find the user to get their level_id (course_id)
    const user = await this.userModel.findByPk(student_id);
    
    if (!user) throw new NotFoundException("User not found");
    if (!user.level_id) throw new NotFoundException("User is not assigned to any course");
    
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
          order: [['order', 'ASC']],
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
