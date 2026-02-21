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
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupHomework } from "../group_homeworks/entities/group_homework.entity.js";
import { HomeworkSubmission } from "../homework_submissions/entities/homework_submission.entity.js";
import { HomeworkSection } from "../homework_submissions/entities/homework_sections.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";

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
    // Find the student's group where isEnglish = true
    const studentGroup = await GroupStudent.findOne({
      where: {
        student_id,
        status: "active",
      },
      include: [
        {
          model: Group,
          as: "group",
          where: { isEnglish: true, isDeleted: false },
          attributes: ["id", "level_id"],
        },
      ],
    });

    if (!studentGroup || !studentGroup.group)
      throw new NotFoundException("Student is not in any English group");

    const courseId = studentGroup.group.level_id;
    if (!courseId)
      throw new NotFoundException("Group is not assigned to any course");

    // Get the course using the group's level_id
    const course = (await this.courseModel.findByPk(courseId, {
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
    const allLessonIds = allLessons.map((l) => l.id);

    // Fetch all needed data in parallel
    const [exercises, speakingTasks, submissions] = await Promise.all([
      Exercise.findAll({
        where: { lessonId: allLessonIds, isActive: true },
      }),
      Speaking.findAll({
        where: { lessonId: allLessonIds },
      }),
      HomeworkSubmission.findAll({
        where: { student_id, lesson_id: allLessonIds },
      }),
    ]);

    const submissionIds = submissions.map((s) => s.id);

    // Get homework sections for these submissions
    const homeworkSections = submissionIds.length
      ? await HomeworkSection.findAll({
          where: { submission_id: submissionIds },
        })
      : [];

    // Build lookup maps
    const exercisesByLessonId = new Map<string, Exercise[]>();
    for (const ex of exercises) {
      const list = exercisesByLessonId.get(ex.lessonId) || [];
      list.push(ex);
      exercisesByLessonId.set(ex.lessonId, list);
    }

    const speakingByLessonId = new Map<string, Speaking[]>();
    for (const sp of speakingTasks) {
      const list = speakingByLessonId.get(sp.lessonId) || [];
      list.push(sp);
      speakingByLessonId.set(sp.lessonId, list);
    }

    const submissionsByLessonId = new Map<string, HomeworkSubmission[]>();
    for (const sub of submissions) {
      if (sub.lesson_id) {
        const list = submissionsByLessonId.get(sub.lesson_id) || [];
        list.push(sub);
        submissionsByLessonId.set(sub.lesson_id, list);
      }
    }

    const sectionsBySubmissionId = new Map<string, HomeworkSection[]>();
    for (const sec of homeworkSections) {
      const list = sectionsBySubmissionId.get(sec.submission_id) || [];
      list.push(sec);
      sectionsBySubmissionId.set(sec.submission_id, list);
    }

    // Count completed lessons based on exercises + speaking tasks
    let completedCount = 0;
    for (const lessonId of allLessonIds) {
      const lessonExercises = exercisesByLessonId.get(lessonId) || [];
      const lessonSpeaking = speakingByLessonId.get(lessonId) || [];
      const totalTasks = lessonExercises.length + lessonSpeaking.length;

      if (totalTasks === 0) continue;

      const lessonSubs = submissionsByLessonId.get(lessonId) || [];
      const lessonSections: HomeworkSection[] = [];
      for (const sub of lessonSubs) {
        const subSections = sectionsBySubmissionId.get(sub.id) || [];
        lessonSections.push(...subSections);
      }

      const completedExerciseIds = new Set(
        lessonSections.filter((s) => s.exercise_id).map((s) => s.exercise_id),
      );
      const completedExercises = lessonExercises.filter((ex) =>
        completedExerciseIds.has(ex.id),
      ).length;

      const completedSpeakingIds = new Set(
        lessonSections.filter((s) => s.speaking_id).map((s) => s.speaking_id),
      );
      const completedSpeakingCount = lessonSpeaking.filter((sp) =>
        completedSpeakingIds.has(sp.id),
      ).length;

      if (completedExercises + completedSpeakingCount >= totalTasks) {
        completedCount++;
      }
    }

    const total = allLessons.length;

    return {
      course_id: courseId,
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
          where: { isActive: true },
          required: false,
          separate: true,
          order: [["order", "ASC"]],
          include: [
            {
              model: Lesson,
              as: "lessons",
              where: { isActive: true },
              required: false,
            },
          ],
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
