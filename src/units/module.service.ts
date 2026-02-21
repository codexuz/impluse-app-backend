import { Injectable, NotFoundException } from "@nestjs/common";
import { Unit } from "./entities/units.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { CreateUnitDto } from "./dto/create-unit.dto.js";
import { UpdateUnitDto } from "./dto/update-unit.dto.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupHomework } from "../group_homeworks/entities/group_homework.entity.js";
import { HomeworkSubmission } from "../homework_submissions/entities/homework_submission.entity.js";
import { HomeworkSection } from "../homework_submissions/entities/homework_sections.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";

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

    if (!allLessonIds.length) {
      return units.map((unit) => ({
        unit_id: unit.id,
        unit_title: unit.title,
        unit_order: unit.order,
        status: "unlocked",
        completed: 0,
        total: 0,
        percentage: 0,
        lessons: [],
      }));
    }

    const groupIds = studentGroups.map((sg) => sg.group_id);

    // Fetch all needed data in parallel
    const [groupHomeworks, exercises, speakingTasks, submissions] =
      await Promise.all([
        GroupHomework.findAll({
          where: { group_id: groupIds, lesson_id: allLessonIds },
        }),
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

    const homeworksByLessonId = new Map<string, GroupHomework[]>();
    for (const hw of groupHomeworks) {
      const list = homeworksByLessonId.get(hw.lesson_id) || [];
      list.push(hw);
      homeworksByLessonId.set(hw.lesson_id, list);
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

    const result = units.map((unit) => {
      const lessonResults = unit.lessons.map((l) => {
        const lessonExercises = exercisesByLessonId.get(l.id) || [];
        const lessonSpeaking = speakingByLessonId.get(l.id) || [];
        const lessonHomeworks = homeworksByLessonId.get(l.id) || [];
        const lessonSubmissions = submissionsByLessonId.get(l.id) || [];

        // Collect all homework sections for this lesson's submissions
        const lessonSections: HomeworkSection[] = [];
        for (const sub of lessonSubmissions) {
          const subSections = sectionsBySubmissionId.get(sub.id) || [];
          lessonSections.push(...subSections);
        }

        // Total tasks = exercises + speaking tasks in this lesson
        const totalExercises = lessonExercises.length;
        const totalSpeaking = lessonSpeaking.length;
        const totalTasks = totalExercises + totalSpeaking;

        // Completed exercises: exercises that have a matching homework_section by exercise_id
        const completedExerciseIds = new Set(
          lessonSections.filter((s) => s.exercise_id).map((s) => s.exercise_id),
        );
        const completedExercises = lessonExercises.filter((ex) =>
          completedExerciseIds.has(ex.id),
        ).length;

        // Completed speaking: speaking tasks that have a matching homework_section by speaking_id
        const completedSpeakingIds = new Set(
          lessonSections.filter((s) => s.speaking_id).map((s) => s.speaking_id),
        );
        const completedSpeakingCount = lessonSpeaking.filter((sp) =>
          completedSpeakingIds.has(sp.id),
        ).length;

        const completedTasks = completedExercises + completedSpeakingCount;

        // Section type breakdown
        const sectionTypes = [
          "reading",
          "listening",
          "grammar",
          "writing",
          "speaking",
        ];
        const completedSectionTypes = sectionTypes.filter((type) =>
          lessonSections.some((s) => s.section === type),
        );

        // Score calculation
        const scoredSections = lessonSections.filter(
          (s) => s.score !== null && s.score !== undefined,
        );
        const averageScore = scoredSections.length
          ? Math.round(
              (scoredSections.reduce((sum, s) => sum + s.score, 0) /
                scoredSections.length) *
                100,
            ) / 100
          : null;

        return {
          lesson_id: l.id,
          lesson_order: l.order,
          lesson_title: l.title,
          lesson_type: l.type,
          status: "unlocked",
          total_homeworks: lessonHomeworks.length,
          submitted_count: lessonSubmissions.length,
          total_tasks: totalTasks,
          completed_tasks: completedTasks,
          total_exercises: totalExercises,
          completed_exercises: completedExercises,
          total_speaking: totalSpeaking,
          completed_speaking: completedSpeakingCount,
          completed_sections: completedSectionTypes,
          completed_sections_count: completedSectionTypes.length,
          total_sections: sectionTypes.length,
          section_percentage: Math.round(
            (completedSectionTypes.length / sectionTypes.length) * 100,
          ),
          task_percentage:
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0,
          average_score: averageScore,
          is_completed: totalTasks > 0 && completedTasks >= totalTasks,
        };
      });

      const completedCount = lessonResults.filter((l) => l.is_completed).length;
      const total = lessonResults.length;

      return {
        unit_id: unit.id,
        unit_title: unit.title,
        unit_order: unit.order,
        status: "unlocked",
        completed: completedCount,
        total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        lessons: lessonResults,
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
