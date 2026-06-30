import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { QueryTypes } from "sequelize";
import { ExamResult } from "./entities/exam_result.entity.js";
import { CreateExamResultDto } from "./dto/create-exam-result.dto.js";
import { UpdateExamResultDto } from "./dto/update-exam-result.dto.js";
import { Exam } from "./entities/exam.entity.js";
import { User } from "../users/entities/user.entity.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectModel(ExamResult)
    private examResultModel: typeof ExamResult,
    @InjectModel(Exam)
    private examModel: typeof Exam,
    private notificationsService: NotificationsService
  ) {}

  async create(createExamResultDto: CreateExamResultDto): Promise<ExamResult> {
    // Check if the exam exists
    const exam = await this.examModel.findByPk(createExamResultDto.exam_id);
    if (!exam) {
      throw new NotFoundException(
        `Exam with ID ${createExamResultDto.exam_id} not found`
      );
    }

    // Calculate percentage if not provided
    if (
      !createExamResultDto.percentage &&
      createExamResultDto.score !== undefined &&
      createExamResultDto.max_score
    ) {
      createExamResultDto.percentage =
        (createExamResultDto.score / createExamResultDto.max_score) * 100;
    }

    // Determine pass/fail result if not provided
    if (
      !createExamResultDto.result &&
      createExamResultDto.percentage !== undefined
    ) {
      createExamResultDto.result =
        createExamResultDto.percentage >= 60 ? "passed" : "failed";
    }

    const examResult = await this.examResultModel.create(createExamResultDto);

    // Send notification to the student
    try {
      const notificationToken = await NotificationToken.findOne({
        where: {
          user_id: createExamResultDto.student_id,
        },
      });

      if (notificationToken) {
        const resultStatus =
          examResult.result === "passed" ? "✅ Passed" : "❌ Failed";
        const score =
          examResult.score !== undefined && examResult.max_score
            ? `${examResult.score}/${examResult.max_score}`
            : examResult.percentage
              ? `${examResult.percentage.toFixed(1)}%`
              : "";

        await this.notificationsService.notifyUser(
          notificationToken.token,
          "Exam Result Available",
          `Your result for "${exam.title}" is ready. ${resultStatus}${score ? " - Score: " + score : ""}`,
          {
            screen: "exams",
            id: exam.id,
            exam_id: exam.id,
            exam_result_id: examResult.id,
            result: examResult.result,
            type: "exam_result_created",
          }
        );
      }
    } catch (error) {
      console.error("Error sending exam result notification:", error);
      // Continue even if notification fails
    }

    return examResult;
  }

  async findAll(): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      include: [
        { model: Exam, as: "exam" },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });
  }

  async findOne(id: string): Promise<ExamResult> {
    const result = await this.examResultModel.findOne({
      where: { id },
      include: [
        { model: Exam, as: "exam" },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });

    if (!result) {
      throw new NotFoundException(`Exam result with ID ${id} not found`);
    }

    return result;
  }

  async findByExam(examId: string): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      where: { exam_id: examId },
      include: [
        { model: Exam, as: "exam" },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });
  }

  async findByStudent(studentId: string): Promise<ExamResult[]> {
    return this.examResultModel.findAll({
      where: { student_id: studentId },
      include: [
        { model: Exam, as: "exam" },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });
  }

  async findByExamAndStudent(
    examId: string,
    studentId: string
  ): Promise<ExamResult> {
    const result = await this.examResultModel.findOne({
      where: {
        exam_id: examId,
        student_id: studentId,
      },
      include: [
        { model: Exam, as: "exam" },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
    });

    if (!result) {
      throw new NotFoundException(
        `Exam result for exam ${examId} and student ${studentId} not found`
      );
    }

    return result;
  }

  async update(
    id: string,
    updateExamResultDto: UpdateExamResultDto
  ): Promise<ExamResult> {
    const result = await this.findOne(id);

    // Recalculate percentage if score or max_score is updated
    if (
      (updateExamResultDto.score !== undefined ||
        updateExamResultDto.max_score !== undefined) &&
      (result.max_score || updateExamResultDto.max_score)
    ) {
      const score = updateExamResultDto.score ?? result.score;
      const maxScore = updateExamResultDto.max_score ?? result.max_score;
      updateExamResultDto.percentage = (score / maxScore) * 100;
    }

    // Update pass/fail status if percentage is updated
    if (updateExamResultDto.percentage !== undefined) {
      updateExamResultDto.result =
        updateExamResultDto.percentage >= 60 ? "passed" : "failed";
    }

    await result.update(updateExamResultDto);
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.findOne(id);
    await result.destroy();
  }

  /**
   * Find students who failed unit tests at least `minFailures` times within a
   * given level (course). A "unit test" is an exam with type = 'unit_test', and
   * the level is matched against exams.level_id (the course UUID).
   *
   * Optionally narrow by group, teacher and/or unit. Since a student may have
   * failed across several groups/units/teachers, the matched ones are returned
   * as aggregated lists per student.
   *
   * Example: pass the elementary course's id with minFailures = 3 to get back
   * "Alex" who failed 3 unit tests in elementary.
   */
  async findUnitTestFailuresByLevel(filters: {
    levelId: string;
    minFailures?: number;
    groupId?: string;
    teacherId?: string;
    unitId?: string;
  }): Promise<
    Array<{
      student_id: string;
      first_name: string;
      last_name: string;
      failed_count: number;
      groups: Array<{ id: string; name: string }>;
      teachers: Array<{ id: string; first_name: string; last_name: string }>;
      units: Array<{ id: string; title: string }>;
    }>
  > {
    const { levelId, groupId, teacherId, unitId } = filters;
    const minFailures = filters.minFailures ?? 3;

    const rows = await this.examResultModel.sequelize.query(
      `
      SELECT
        er.student_id,
        u.first_name,
        u.last_name,
        COUNT(*) AS failed_count,
        CONCAT('[', GROUP_CONCAT(DISTINCT
          JSON_OBJECT('id', e.group_id, 'name', g.name)), ']') AS groups_raw,
        CONCAT('[', GROUP_CONCAT(DISTINCT
          JSON_OBJECT('id', e.teacher_id, 'first_name', t.first_name, 'last_name', t.last_name)), ']') AS teachers_raw,
        CONCAT('[', GROUP_CONCAT(DISTINCT
          JSON_OBJECT('id', e.unit_id, 'title', un.title)), ']') AS units_raw
      FROM exam_results er
      JOIN exams e ON e.id = er.exam_id AND e.deleted_at IS NULL
      JOIN users u ON u.user_id = er.student_id
      LEFT JOIN \`groups\` g ON g.id = e.group_id
      LEFT JOIN users t ON t.user_id = e.teacher_id
      LEFT JOIN units un ON un.id = e.unit_id
      WHERE er.result = 'failed'
        AND e.type = 'unit_test'
        AND e.level_id = :levelId
        AND (:groupId IS NULL OR e.group_id = :groupId)
        AND (:teacherId IS NULL OR e.teacher_id = :teacherId)
        AND (:unitId IS NULL OR e.unit_id = :unitId)
      GROUP BY er.student_id, u.first_name, u.last_name
      HAVING COUNT(*) >= :minFailures
      ORDER BY failed_count DESC
      `,
      {
        replacements: {
          levelId,
          minFailures,
          groupId: groupId ?? null,
          teacherId: teacherId ?? null,
          unitId: unitId ?? null,
        },
        type: QueryTypes.SELECT,
      }
    );

    const parseJson = <T>(raw: string | null): T[] => {
      if (!raw) return [];
      const arr = JSON.parse(raw) as Array<Record<string, unknown>>;
      // Filter out rows where the joined id was NULL (LEFT JOIN misses).
      return arr.filter((o) => o && o.id != null) as T[];
    };

    return rows.map((r: any) => ({
      student_id: r.student_id,
      first_name: r.first_name,
      last_name: r.last_name,
      failed_count: Number(r.failed_count),
      groups: parseJson<{ id: string; name: string }>(r.groups_raw),
      teachers: parseJson<{
        id: string;
        first_name: string;
        last_name: string;
      }>(r.teachers_raw),
      units: parseJson<{ id: string; title: string }>(r.units_raw),
    }));
  }

  async getExamStatistics(examId: string): Promise<{
    totalStudents: number;
    averageScore: number;
    passRate: number;
    sectionAverages: { [key: string]: number };
  }> {
    const results = await this.findByExam(examId);

    if (results.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        passRate: 0,
        sectionAverages: {},
      };
    }

    const totalStudents = results.length;
    const averageScore =
      results.reduce((sum, result) => sum + result.percentage, 0) /
      totalStudents;
    const passedCount = results.filter(
      (result) => result.result === "passed"
    ).length;
    const passRate = (passedCount / totalStudents) * 100;

    // Calculate section averages
    const sectionTotals: { [key: string]: { sum: number; count: number } } = {};
    const sectionTypes = [
      "reading",
      "writing",
      "listening",
      "speaking",
      "grammar",
      "vocabulary",
    ];

    results.forEach((result) => {
      if (result.section_scores) {
        Object.entries(result.section_scores).forEach(([section, score]) => {
          if (!sectionTotals[section]) {
            sectionTotals[section] = { sum: 0, count: 0 };
          }
          sectionTotals[section].sum += score;
          sectionTotals[section].count += 1;
        });
      }
    });

    const sectionAverages: { [key: string]: number } = {};
    Object.entries(sectionTotals).forEach(([section, { sum, count }]) => {
      sectionAverages[section] = count > 0 ? sum / count : 0;
    });

    return {
      totalStudents,
      averageScore,
      passRate,
      sectionAverages,
    };
  }
}
