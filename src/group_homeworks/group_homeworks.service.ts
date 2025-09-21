import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateGroupHomeworkDto } from "./dto/create-group-homework.dto.js";
import { UpdateGroupHomeworkDto } from "./dto/update-group_homework.dto.js";
import { GroupHomework } from "./entities/group_homework.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { LessonContent } from "../lesson-content/entities/lesson-content.entity.js";
import { LessonVocabularySet } from "../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js";
import { HomeworkSubmission } from "../homework_submissions/entities/homework_submission.entity.js";

import { Op } from "sequelize";

@Injectable()
export class GroupHomeworksService {
  constructor(
    @InjectModel(GroupHomework)
    private groupHomeworkModel: typeof GroupHomework,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(Lesson)
    private lessonModel: typeof Lesson,
    @InjectModel(Exercise)
    private exerciseModel: typeof Exercise,
    @InjectModel(Speaking)
    private speakingModel: typeof Speaking,
    @InjectModel(LessonContent)
    private lessonContentModel: typeof LessonContent,
    @InjectModel(LessonVocabularySet)
    private lessonVocabularySetModel: typeof LessonVocabularySet,
    @InjectModel(HomeworkSubmission)
    private homeworkSubmissionModel: typeof HomeworkSubmission
  ) {}

  async create(createDto: CreateGroupHomeworkDto): Promise<GroupHomework> {
    return await this.groupHomeworkModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<GroupHomework[]> {
    return await this.groupHomeworkModel.findAll({
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.exerciseModel,
              as: "exercises",
            },
            {
              model: this.speakingModel,
              as: "speaking",
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string): Promise<GroupHomework> {
    const homework = await this.groupHomeworkModel.findOne({
      where: { id },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
            },
            {
              model: this.speakingModel,
              as: "speaking",
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
            },
          ],
        },
      ],
    });

    if (!homework) {
      throw new NotFoundException(`Group homework with ID ${id} not found`);
    }

    return homework;
  }

  async findByGroupId(groupId: string): Promise<GroupHomework[]> {
    return await this.groupHomeworkModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
            },
            {
              model: this.speakingModel,
              as: "speaking",
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
            },
          ],
        },
      ],
    });
  }

  async findByTeacherId(teacherId: string): Promise<GroupHomework[]> {
    return await this.groupHomeworkModel.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
            },
            {
              model: this.speakingModel,
              as: "speaking",
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
            },
          ],
        },
      ],
    });
  }

  async findByLessonId(lessonId: string): Promise<GroupHomework[]> {
    return await this.groupHomeworkModel.findAll({
      where: { lesson_id: lessonId },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
            },
            {
              model: this.speakingModel,
              as: "speaking",
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
            },
          ],
        },
      ],
    });
  }

  async update(
    id: string,
    updateDto: UpdateGroupHomeworkDto
  ): Promise<GroupHomework> {
    const [affectedCount] = await this.groupHomeworkModel.update(updateDto, {
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`Group homework with ID ${id} not found`);
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupHomeworkModel.destroy({
      where: { id },
    });

    if (result === 0) {
      throw new NotFoundException(`Group homework with ID ${id} not found`);
    }
  }

  async getHomeworksForUser(userId: string): Promise<any[]> {
    const groupStudent = await this.groupStudentModel.findOne({
      where: { student_id: userId },
    });

    if (!groupStudent) {
      throw new NotFoundException("User is not in any group");
    }

    const homeworks = await this.groupHomeworkModel.findAll({
      where: { group_id: groupStudent.group_id },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
              attributes: ["id", "exercise_type", "lessonId"],
            },
            {
              model: this.speakingModel,
              as: "speaking",
              attributes: ["id", "lessonId"],
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
              attributes: ["id", "lesson_id", "vocabulary_item_id"],
            },
          ],
        },
      ],
    });

    // Convert homeworks to plain JSON objects and add basic information
    const homeworksWithStatus = homeworks.map((homework) => {
      const homeworkData = homework.toJSON();

      // Include exercises without submission or status
      if (homeworkData.lesson && homeworkData.lesson.exercises) {
        homeworkData.lesson.exercises = homeworkData.lesson.exercises.map(
          (exercise) => {
            return {
              ...exercise
            };
          }
        );
      }

      // Include speaking exercises without submission or status
      if (homeworkData.lesson && homeworkData.lesson.speaking) {
        homeworkData.lesson.speaking = {
          ...homeworkData.lesson.speaking
        };
      }

      // Include vocabulary data without submission or status
      if (homeworkData.lesson && homeworkData.lesson.lesson_vocabulary) {
        homeworkData.lesson.lesson_vocabulary =
          homeworkData.lesson.lesson_vocabulary.map((vocab) => {
            return {
              ...vocab
            };
          });
      }

      return {
        ...homeworkData,
        isOverdue:
          homework.deadline && new Date(homework.deadline) < new Date()
      };
    });

    return homeworksWithStatus as any;
  }

  async getActiveHomeworksByDate(userId: string, date?: Date): Promise<any[]> {
    const groupStudent = await this.groupStudentModel.findOne({
      where: { student_id: userId },
    });

    if (!groupStudent) {
      throw new NotFoundException("User is not in any group");
    }

    // If no date is provided, use current date
    const currentDate = date ? date : new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const homeworks = await this.groupHomeworkModel.findAll({
      where: {
        group_id: groupStudent.group_id,
        // Active homework has start_date before or equal to current date
        // and deadline after or equal to current date
        start_date: {
          [Op.lte]: formattedDate, // less than or equal to current date
        },
        deadline: {
          [Op.gte]: formattedDate, // greater than or equal to current date
        },
      },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
              attributes: ["id", "exercise_type", "lessonId"],
            },
            {
              model: this.speakingModel,
              as: "speaking",
              attributes: ["id", "lessonId"],
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
              attributes: ["id", "lesson_id"],
            },
          ],
        },
      ],
    });

    // Convert homeworks to plain JSON objects and add basic information
    const homeworksData = homeworks.map((homework) => {
      const homeworkData = homework.toJSON();

      return {
        ...homeworkData,
        isOverdue:
          homework.deadline && new Date(homework.deadline) < new Date(),
        isActive: true, // Since this method only returns active homeworks
      };
    });

    return homeworksData;
  }

  /**
   * Get homework with detailed lesson content including exercises and speaking activities
   * @param homeworkId The ID of the homework to fetch
   * @returns The homework with all related lesson content
   */
  async getHomeworkWithLessonContent(
    homeworkId: string
  ): Promise<GroupHomework> {
    const homework = await this.groupHomeworkModel.findOne({
      where: { id: homeworkId },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          include: [
            {
              model: this.lessonContentModel,
              as: "theory",
            },
            {
              model: this.exerciseModel,
              as: "exercises",
              attributes: ["id", "exercise_type", "lessonId"],
            },
            {
              model: this.speakingModel,
              as: "speaking",
              attributes: ["id", "lessonId"],
            },
            {
              model: this.lessonVocabularySetModel,
              as: "lesson_vocabulary",
              attributes: ["id", "lesson_id"],
            },
          ],
        },
      ],
    });

    if (!homework) {
      throw new NotFoundException(
        `Group homework with ID ${homeworkId} not found`
      );
    }

    return homework;
  }

  async getHomeworkStatusByStudent(studentId: string, groupId?: string) {
    // Get all group homeworks for the student's groups
    const groupWhere: any = {};
    if (groupId) {
      groupWhere.group_id = groupId;
    } else {
      // Get all groups the student belongs to
      const studentGroups = await this.groupStudentModel.findAll({
        where: { student_id: studentId },
        attributes: ["group_id"],
      });
      const groupIds = studentGroups.map((sg) => sg.group_id);
      groupWhere.group_id = { [Op.in]: groupIds };
    }

    const homeworks = await this.groupHomeworkModel.findAll({
      where: groupWhere,
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          attributes: ["id", "title"],
        },
      ],
      order: [["deadline", "ASC"]],
    });

    // Get all submissions for this student
    const submissions = await this.homeworkSubmissionModel.findAll({
      where: {
        student_id: studentId,
        homework_id: { [Op.in]: homeworks.map((h) => h.id) },
      },
    });

    // Create a map of homework submissions by homework_id
    const submissionMap = new Map();
    submissions.forEach((submission) => {
      const key = submission.homework_id;
      if (!submissionMap.has(key)) {
        submissionMap.set(key, []);
      }
      submissionMap.get(key).push(submission);
    });

    // Categorize homeworks
    const finishedHomeworks = [];
    const unfinishedHomeworks = [];

    homeworks.forEach((homework) => {
      const homeworkSubmissions = submissionMap.get(homework.id) || [];

      // Check if homework is finished (has submissions with passed/failed status)
      const isFinished = homeworkSubmissions.some(
        (sub) => sub.status === "passed" || sub.status === "failed"
      );

      const homeworkData = {
        ...homework.toJSON(),
        submissions: homeworkSubmissions,
        submissionCount: homeworkSubmissions.length,
        isOverdue:
          homework.deadline && new Date(homework.deadline) < new Date(),
      };

      if (isFinished) {
        finishedHomeworks.push(homeworkData);
      } else {
        unfinishedHomeworks.push(homeworkData);
      }
    });

    return {
      studentId,
      groupId,
      summary: {
        total: homeworks.length,
        finished: finishedHomeworks.length,
        unfinished: unfinishedHomeworks.length,
        overdue: unfinishedHomeworks.filter((h) => h.isOverdue).length,
      },
      finishedHomeworks,
      unfinishedHomeworks,
    };
  }

  async getHomeworkStatusByGroup(groupId: string) {
    // Get all students in the group
    const groupStudents = await this.groupStudentModel.findAll({
      where: { group_id: groupId },
      attributes: ["student_id"],
    });
    const studentIds = groupStudents.map((gs) => gs.student_id);

    // Get all homeworks for this group
    const homeworks = await this.groupHomeworkModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: this.lessonModel,
          as: "lesson",
          attributes: ["id", "title"],
        },
      ],
      order: [["deadline", "ASC"]],
    });

    // Get all submissions for these homeworks
    const submissions = await this.homeworkSubmissionModel.findAll({
      where: {
        homework_id: { [Op.in]: homeworks.map((h) => h.id) },
        student_id: { [Op.in]: studentIds },
      },
    });

    // Group submissions by homework and student
    const submissionMap = new Map();
    submissions.forEach((submission) => {
      const key = `${submission.homework_id}_${submission.student_id}`;
      if (!submissionMap.has(key)) {
        submissionMap.set(key, []);
      }
      submissionMap.get(key).push(submission);
    });

    const homeworksWithStatus = homeworks.map((homework) => {
      const studentSubmissions = [];
      let finishedCount = 0;
      let unfinishedCount = 0;

      studentIds.forEach((studentId) => {
        const key = `${homework.id}_${studentId}`;
        const studentSubmissionsList = submissionMap.get(key) || [];

        const isFinished = studentSubmissionsList.some(
          (sub) => sub.status === "passed" || sub.status === "failed"
        );

        studentSubmissions.push({
          studentId,
          submissions: studentSubmissionsList,
          isFinished,
          submissionCount: studentSubmissionsList.length,
        });

        if (isFinished) {
          finishedCount++;
        } else {
          unfinishedCount++;
        }
      });

      return {
        ...homework.toJSON(),
        studentSubmissions,
        summary: {
          totalStudents: studentIds.length,
          finished: finishedCount,
          unfinished: unfinishedCount,
          completionRate:
            studentIds.length > 0
              ? ((finishedCount / studentIds.length) * 100).toFixed(2)
              : "0.00",
        },
        isOverdue:
          homework.deadline && new Date(homework.deadline) < new Date(),
      };
    });

    return {
      groupId,
      studentCount: studentIds.length,
      summary: {
        totalHomeworks: homeworks.length,
        overdueHomeworks: homeworksWithStatus.filter((h) => h.isOverdue).length,
      },
      homeworks: homeworksWithStatus,
    };
  }

  async getOverallHomeworkStats(groupId?: string) {
    const whereClause: any = {};
    if (groupId) {
      whereClause.group_id = groupId;
    }

    const totalHomeworks = await this.groupHomeworkModel.count({
      where: whereClause,
    });

    const overdueHomeworks = await this.groupHomeworkModel.count({
      where: {
        ...whereClause,
        deadline: { [Op.lt]: new Date() },
      },
    });

    const upcomingHomeworks = await this.groupHomeworkModel.count({
      where: {
        ...whereClause,
        deadline: { [Op.gt]: new Date() },
      },
    });

    return {
      groupId,
      totalHomeworks,
      overdueHomeworks,
      upcomingHomeworks,
      noDeadlineHomeworks:
        totalHomeworks - overdueHomeworks - upcomingHomeworks,
    };
  }
}
