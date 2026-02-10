import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { IeltsCourse } from "./entities/ielts-course.entity.js";
import { IeltsCourseSection } from "./entities/ielts-course-section.entity.js";
import { IeltsLesson } from "./entities/ielts-lesson.entity.js";
import { IeltsQuiz } from "./entities/ielts-quiz.entity.js";
import { IeltsQuizQuestion } from "./entities/ielts-quiz-question.entity.js";
import { IeltsQuestionChoice } from "./entities/ielts-question-choice.entity.js";
import { IeltsQuestionAcceptedAnswer } from "./entities/ielts-question-accepted-answer.entity.js";
import { IeltsLessonProgress } from "./entities/ielts-lesson-progress.entity.js";
import { IeltsQuizAttempt } from "./entities/ielts-quiz-attempt.entity.js";
import { IeltsAttemptAnswer } from "./entities/ielts-attempt-answer.entity.js";
import { CreateIeltsCourseDto } from "./dto/create-ielts-course.dto.js";
import { UpdateIeltsCourseDto } from "./dto/update-ielts-course.dto.js";
import { CreateCourseSectionDto } from "./dto/create-course-section.dto.js";
import { UpdateCourseSectionDto } from "./dto/update-course-section.dto.js";
import { CreateLessonDto } from "./dto/create-lesson.dto.js";
import { UpdateLessonDto } from "./dto/update-lesson.dto.js";
import { CreateQuizDto } from "./dto/create-quiz.dto.js";
import { UpdateQuizDto } from "./dto/update-quiz.dto.js";
import { CreateQuizQuestionDto } from "./dto/create-quiz-question.dto.js";
import { UpdateQuizQuestionDto } from "./dto/update-quiz-question.dto.js";
import { CreateLessonProgressDto } from "./dto/create-lesson-progress.dto.js";
import { UpdateLessonProgressDto } from "./dto/update-lesson-progress.dto.js";
import { CreateQuizAttemptDto } from "./dto/create-quiz-attempt.dto.js";
import { CreateAttemptAnswerDto } from "./dto/create-attempt-answer.dto.js";
import {
  CourseQueryDto,
  SectionQueryDto,
  LessonQueryDto,
  QuizQueryDto,
  QuizQuestionQueryDto,
} from "./dto/query.dto.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class IeltsCoursesService {
  constructor(
    @InjectModel(IeltsCourse)
    private readonly courseModel: typeof IeltsCourse,
    @InjectModel(IeltsCourseSection)
    private readonly sectionModel: typeof IeltsCourseSection,
    @InjectModel(IeltsLesson)
    private readonly lessonModel: typeof IeltsLesson,
    @InjectModel(IeltsQuiz)
    private readonly quizModel: typeof IeltsQuiz,
    @InjectModel(IeltsQuizQuestion)
    private readonly questionModel: typeof IeltsQuizQuestion,
    @InjectModel(IeltsQuestionChoice)
    private readonly choiceModel: typeof IeltsQuestionChoice,
    @InjectModel(IeltsQuestionAcceptedAnswer)
    private readonly acceptedAnswerModel: typeof IeltsQuestionAcceptedAnswer,
    @InjectModel(IeltsLessonProgress)
    private readonly lessonProgressModel: typeof IeltsLessonProgress,
    @InjectModel(IeltsQuizAttempt)
    private readonly quizAttemptModel: typeof IeltsQuizAttempt,
    @InjectModel(IeltsAttemptAnswer)
    private readonly attemptAnswerModel: typeof IeltsAttemptAnswer,
  ) {}

  // ========== Courses ==========
  async createCourse(dto: CreateIeltsCourseDto) {
    return await this.courseModel.create(dto as any);
  }

  async findAllCourses(query: CourseQueryDto) {
    const { page = 1, limit = 10, search, status } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }

    const { rows, count } = await this.courseModel.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findCourseById(id: string) {
    const course = await this.courseModel.findByPk(id, {
      include: [
        {
          model: IeltsCourseSection,
          as: "sections",
          include: [
            {
              model: IeltsLesson,
              as: "lessons",
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

  async updateCourse(id: string, dto: UpdateIeltsCourseDto) {
    const course = await this.findCourseById(id);
    await course.update(dto as any);
    return course;
  }

  async deleteCourse(id: string) {
    const course = await this.findCourseById(id);
    await course.destroy();
  }

  // ========== Course Sections ==========
  async createSection(dto: CreateCourseSectionDto) {
    return await this.sectionModel.create(dto as any);
  }

  async findAllSections(query: SectionQueryDto) {
    const { page = 1, limit = 10, search, courseId } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (courseId) {
      where.course_id = courseId;
    }

    const { rows, count } = await this.sectionModel.findAndCountAll({
      where,
      include: [{ model: IeltsCourse, as: "course" }],
      order: [["position", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findSectionById(id: string) {
    const section = await this.sectionModel.findByPk(id, {
      include: [
        { model: IeltsCourse, as: "course" },
        { model: IeltsLesson, as: "lessons" },
      ],
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async updateSection(id: string, dto: UpdateCourseSectionDto) {
    const section = await this.findSectionById(id);
    await section.update(dto as any);
    return section;
  }

  async deleteSection(id: string) {
    const section = await this.findSectionById(id);
    await section.destroy();
  }

  // ========== Lessons ==========
  async createLesson(dto: CreateLessonDto) {
    return await this.lessonModel.create(dto as any);
  }

  async findAllLessons(query: LessonQueryDto) {
    const { page = 1, limit = 10, search, sectionId } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (sectionId) {
      where.section_id = sectionId;
    }

    const { rows, count } = await this.lessonModel.findAndCountAll({
      where,
      include: [{ model: IeltsCourseSection, as: "section" }],
      order: [["position", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findLessonById(id: string) {
    const lesson = await this.lessonModel.findByPk(id, {
      include: [{ model: IeltsCourseSection, as: "section" }],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async updateLesson(id: string, dto: UpdateLessonDto) {
    const lesson = await this.findLessonById(id);
    await lesson.update(dto as any);
    return lesson;
  }

  async deleteLesson(id: string) {
    const lesson = await this.findLessonById(id);
    await lesson.destroy();
  }

  // ========== Quizzes ==========
  async createQuiz(dto: CreateQuizDto) {
    return await this.quizModel.create(dto as any);
  }

  async findAllQuizzes(query: QuizQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      courseId,
      sectionId,
      lessonId,
      isPublished,
    } = query;
    const where: any = {};

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (courseId) {
      where.course_id = courseId;
    }
    if (sectionId) {
      where.section_id = sectionId;
    }
    if (lessonId) {
      where.lesson_id = lessonId;
    }
    if (isPublished !== undefined) {
      where.is_published = isPublished;
    }

    const { rows, count } = await this.quizModel.findAndCountAll({
      where,
      include: [
        { model: IeltsCourse, as: "course" },
        { model: IeltsCourseSection, as: "section" },
        { model: IeltsLesson, as: "lesson" },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findQuizById(id: string) {
    const quiz = await this.quizModel.findByPk(id, {
      include: [
        { model: IeltsCourse, as: "course" },
        { model: IeltsCourseSection, as: "section" },
        { model: IeltsLesson, as: "lesson" },
        {
          model: IeltsQuizQuestion,
          as: "questions",
          include: [
            { model: IeltsQuestionChoice, as: "choices" },
            { model: IeltsQuestionAcceptedAnswer, as: "acceptedAnswers" },
          ],
        },
      ],
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async updateQuiz(id: string, dto: UpdateQuizDto) {
    const quiz = await this.findQuizById(id);
    await quiz.update(dto as any);
    return quiz;
  }

  async deleteQuiz(id: string) {
    const quiz = await this.findQuizById(id);
    await quiz.destroy();
  }

  // ========== Quiz Questions ==========
  async createQuizQuestion(dto: CreateQuizQuestionDto) {
    return await this.questionModel.create(dto as any, {
      include: [
        { model: IeltsQuestionChoice, as: "choices" },
        { model: IeltsQuestionAcceptedAnswer, as: "acceptedAnswers" },
      ],
    });
  }

  async findAllQuizQuestions(query: QuizQuestionQueryDto) {
    const { page = 1, limit = 10, search, quizId } = query;
    const where: any = {};

    if (search) {
      where.prompt = { [Op.like]: `%${search}%` };
    }
    if (quizId) {
      where.quiz_id = quizId;
    }

    const { rows, count } = await this.questionModel.findAndCountAll({
      where,
      include: [
        { model: IeltsQuestionChoice, as: "choices" },
        { model: IeltsQuestionAcceptedAnswer, as: "acceptedAnswers" },
      ],
      order: [["position", "ASC"]],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findQuizQuestionById(id: string) {
    const question = await this.questionModel.findByPk(id, {
      include: [
        { model: IeltsQuiz, as: "quiz" },
        { model: IeltsQuestionChoice, as: "choices" },
        { model: IeltsQuestionAcceptedAnswer, as: "acceptedAnswers" },
      ],
    });

    if (!question) {
      throw new NotFoundException(`Quiz question with ID ${id} not found`);
    }

    return question;
  }

  async updateQuizQuestion(id: string, dto: UpdateQuizQuestionDto) {
    const question = await this.findQuizQuestionById(id);
    await question.update(dto as any);
    return question;
  }

  async deleteQuizQuestion(id: string) {
    const question = await this.findQuizQuestionById(id);
    await question.destroy();
  }

  // ========== Lesson Progress ==========
  async createLessonProgress(dto: CreateLessonProgressDto) {
    return await this.lessonProgressModel.create(dto as any);
  }

  async findLessonProgress(userId: string, lessonId: string) {
    const progress = await this.lessonProgressModel.findOne({
      where: { user_id: userId, lesson_id: lessonId },
      include: [{ model: IeltsLesson, as: "lesson" }],
    });

    if (!progress) {
      throw new NotFoundException(`Lesson progress not found`);
    }

    return progress;
  }

  async updateLessonProgress(id: string, dto: UpdateLessonProgressDto) {
    const progress = await this.lessonProgressModel.findByPk(id);
    if (!progress) {
      throw new NotFoundException(`Lesson progress with ID ${id} not found`);
    }
    await progress.update(dto as any);
    return progress;
  }

  // ========== Quiz Attempts ==========
  async createQuizAttempt(dto: CreateQuizAttemptDto) {
    return await this.quizAttemptModel.create({
      ...dto,
      started_at: new Date(),
    } as any);
  }

  async findQuizAttemptById(id: string) {
    const attempt = await this.quizAttemptModel.findByPk(id, {
      include: [
        { model: IeltsQuiz, as: "quiz" },
        {
          model: IeltsAttemptAnswer,
          as: "answers",
          include: [
            { model: IeltsQuizQuestion, as: "question" },
            { model: IeltsQuestionChoice, as: "choice" },
          ],
        },
      ],
    });

    if (!attempt) {
      throw new NotFoundException(`Quiz attempt with ID ${id} not found`);
    }

    return attempt;
  }

  async submitQuizAttempt(id: string) {
    const attempt = await this.findQuizAttemptById(id);
    await attempt.update({ submitted_at: new Date() });
    return attempt;
  }

  // ========== Attempt Answers ==========
  async createAttemptAnswer(dto: CreateAttemptAnswerDto) {
    return await this.attemptAnswerModel.create({
      ...dto,
      answered_at: new Date(),
    } as any);
  }
}
