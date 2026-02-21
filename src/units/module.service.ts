import { Injectable, NotFoundException } from "@nestjs/common";
import { Unit } from "./entities/units.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { CreateUnitDto } from "./dto/create-unit.dto.js";
import { UpdateUnitDto } from "./dto/update-unit.dto.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";

@Injectable()
export class ModuleService {
  async create(createUnitDto: CreateUnitDto) {
    return await Unit.create({
      ...createUnitDto,
      isActive: createUnitDto.isActive ?? true,
    });
  }

  findAll() {
    return Unit.findAll({
      where: {
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: Lesson,
          as: "lessons",
          separate: true,
          order: [["order", "ASC"]],
        },
      ],
    });
  }

  findOne(id: string) {
    return Unit.findOne({
      where: {
        id,
        isActive: true,
      },
      include: [
        {
          model: Lesson,
          as: "lessons",
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
    });
  }

  async getRoadMapWithProgress(student_id: string) {
    // First, find the student's groups where isEnglish = true
    const studentGroups = await GroupStudent.findAll({
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

    if (!studentGroups.length) {
      return [];
    }

    // Extract unique course IDs (level_id) from the groups
    const courseIds = [
      ...new Set(
        studentGroups
          .map((sg) => sg.group?.level_id)
          .filter((id): id is string => !!id),
      ),
    ];

    if (!courseIds.length) {
      return [];
    }

    // Get units for these courses directly
    const units = (await Unit.findAll({
      where: {
        courseId: courseIds,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: Lesson,
          as: "lessons",
          where: { isActive: true },
          required: false,
          separate: true,
          order: [["order", "ASC"]],
        },
      ],
    })) as (Unit & { lessons: Lesson[] })[];

    // Extract all lesson IDs
    const allLessonIds = units.flatMap((unit) => unit.lessons.map((l) => l.id));

    const completedLessons = await LessonProgress.findAll({
      where: {
        student_id,
        lesson_id: allLessonIds,
      },
      attributes: ["lesson_id"],
    });

    const completedLessonIds = completedLessons.map((p) => p.lesson_id);

    const result = units.map((unit) => {
      const lessonIds = unit.lessons.map((l) => l.id);
      const completedCount = lessonIds.filter((id) =>
        completedLessonIds.includes(id),
      ).length;
      const total = lessonIds.length;

      return {
        unit_id: unit.id,
        unit_title: unit.title,
        unit_order: unit.order,
        completed: completedCount,
        total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        lessons: unit.lessons.map((l) => ({
          lesson_id: l.id,
          lesson_order: l.order,
          lesson_title: l.title,
          lesson_type: l.type,
          is_completed: completedLessonIds.includes(l.id),
        })),
      };
    });

    return result;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    const unit = await Unit.findByPk(id);
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    await unit.update(updateUnitDto);
    return unit;
  }

  remove(id: string) {
    return Unit.destroy({
      where: { id },
      force: true,
    });
  }

  async findByCourse(
    courseId: string,
    throwIfEmpty: boolean = false,
  ): Promise<Unit[]> {
    const units = await Unit.findAll({
      where: {
        courseId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: Lesson,
          as: "lessons",
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!units.length && throwIfEmpty) {
      throw new NotFoundException(`No units found for course ID ${courseId}`);
    }

    return units;
  }

  async findByCourseWithProgress(
    courseId: string,
    studentId?: string,
  ): Promise<any[]> {
    const units = (await Unit.findAll({
      where: {
        courseId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      include: [
        {
          model: Lesson,
          as: "lessons",
          where: { isActive: true },
          required: false,
          order: [["order", "ASC"]],
        },
      ],
    })) as (Unit & { lessons?: Lesson[] })[];

    if (!studentId) {
      return units.map((unit) => ({
        ...unit.toJSON(),
        completed: 0,
        total: unit.lessons?.length || 0,
        percentage: 0,
      }));
    }

    // Get all lesson IDs for progress tracking
    const allLessonIds = units.flatMap(
      (unit) => unit.lessons?.map((lesson) => lesson.id) || [],
    );

    const completedLessons = await LessonProgress.findAll({
      where: {
        student_id: studentId,
        lesson_id: allLessonIds,
      },
      attributes: ["lesson_id"],
    });

    const completedLessonIds = completedLessons.map((p) => p.lesson_id);

    return units.map((unit) => {
      const lessonIds = unit.lessons?.map((lesson) => lesson.id) || [];
      const completedCount = lessonIds.filter((id) =>
        completedLessonIds.includes(id),
      ).length;
      const total = lessonIds.length;

      return {
        ...unit.toJSON(),
        completed: completedCount,
        total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      };
    });
  }
}
