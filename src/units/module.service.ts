import { Injectable, NotFoundException } from "@nestjs/common";
import { Unit } from "./entities/units.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { CreateUnitDto } from "./dto/create-unit.dto.js";
import { UpdateUnitDto } from "./dto/update-unit.dto.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { GroupAssignedUnit } from "../group_assigned_units/entities/group_assigned_unit.entity.js";
import { GroupAssignedLesson } from "../group_assigned_lessons/entities/group_assigned_lesson.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";

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
    // First, find the student's groups
    const studentGroups = await GroupStudent.findAll({
      where: {
        student_id,
        status: 'active' // Only include active enrollments
      },
      attributes: ['group_id']
    });

    if (!studentGroups.length) {
      return []; // Return empty array if student is not in any group
    }

    // Extract group IDs
    const groupIds = studentGroups.map(sg => sg.group_id);

    // Get assigned units for these groups only
    const assignedUnits = await GroupAssignedUnit.findAll({
      where: {
        group_id: groupIds
      },
      include: [
        {
          model: Unit,
          as: 'unit',
        },
        {
          model: GroupAssignedLesson,
          as: 'lessons',
          separate: true,
          include: [
            {
              model: Lesson,
              as: 'lesson',
            },
          ],
        },
      ],
      order: [[{ model: Unit, as: 'unit' }, 'order', 'ASC']]
    }) as (GroupAssignedUnit & {
      unit: Unit;
      lessons: (GroupAssignedLesson & {
        lesson: Lesson;
      })[];
    })[];
  
    // Extract all lesson IDs
    const allAssignedLessons = assignedUnits.flatMap((unit) =>
      unit.lessons.map((l) => l.lesson.id)
    );
  
    const completedLessons = await LessonProgress.findAll({
      where: {
        student_id,
        lesson_id: allAssignedLessons,
      },
      attributes: ['lesson_id'],
    });
  
    const completedLessonIds = completedLessons.map((p) => p.lesson_id);
  
    const result = assignedUnits.map((unit) => {
      // Order lessons by the lesson's order property
      const orderedLessons = [...unit.lessons].sort((a, b) => {
        // Sort by the lesson's order property
        return a.lesson.order - b.lesson.order;
      });

      const lessonIds = orderedLessons.map((l) => l.lesson.id);
      const completedCount = lessonIds.filter((id) =>
        completedLessonIds.includes(id)
      ).length;
      const total = lessonIds.length;
  
      return {
        unit_id: unit.unit.id,
        unit_title: unit.unit.title,
        unit_order: unit.unit.order,
        status: unit.status,
        completed: completedCount,
        total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        lessons: orderedLessons.map(l => ({
          ...l.toJSON(),
          lesson_order: l.lesson.order,
          lesson_title: l.lesson.title,
          is_completed: completedLessonIds.includes(l.lesson.id)
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
    })
  }

  async findByCourse(courseId: string, throwIfEmpty: boolean = false): Promise<Unit[]> {
    const units = await Unit.findAll({
      where: { 
        courseId,
        isActive: true 
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Lesson,
          as: 'lessons',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!units.length && throwIfEmpty) {
      throw new NotFoundException(`No units found for course ID ${courseId}`);
    }

    return units;
  }

  async findByCourseWithProgress(courseId: string, studentId?: string): Promise<any[]> {
    const units = await Unit.findAll({
      where: { 
        courseId,
        isActive: true 
      },
      order: [['order', 'ASC']],
      include: [
        {
          model: Lesson,
          as: 'lessons',
          where: { isActive: true },
          required: false,
          order: [['order', 'ASC']]
        }
      ]
    }) as (Unit & { lessons?: Lesson[] })[];

    if (!studentId) {
      return units.map(unit => ({
        ...unit.toJSON(),
        completed: 0,
        total: unit.lessons?.length || 0,
        percentage: 0
      }));
    }

    // Get all lesson IDs for progress tracking
    const allLessonIds = units.flatMap(unit => 
      unit.lessons?.map(lesson => lesson.id) || []
    );

    const completedLessons = await LessonProgress.findAll({
      where: {
        student_id: studentId,
        lesson_id: allLessonIds,
      },
      attributes: ['lesson_id'],
    });

    const completedLessonIds = completedLessons.map(p => p.lesson_id);

    return units.map(unit => {
      const lessonIds = unit.lessons?.map(lesson => lesson.id) || [];
      const completedCount = lessonIds.filter(id => 
        completedLessonIds.includes(id)
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
