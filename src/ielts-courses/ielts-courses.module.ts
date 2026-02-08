import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IeltsCoursesService } from "./ielts-courses.service.js";
import { IeltsCoursesController } from "./ielts-courses.controller.js";
import { IeltsCourseSectionsController } from "./ielts-course-sections.controller.js";
import { IeltsLessonsController } from "./ielts-lessons.controller.js";
import { IeltsQuizzesController } from "./ielts-quizzes.controller.js";
import { IeltsQuizQuestionsController } from "./ielts-quiz-questions.controller.js";
import { IeltsLessonProgressController } from "./ielts-lesson-progress.controller.js";
import { IeltsQuizAttemptsController } from "./ielts-quiz-attempts.controller.js";
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

@Module({
  imports: [
    SequelizeModule.forFeature([
      IeltsCourse,
      IeltsCourseSection,
      IeltsLesson,
      IeltsQuiz,
      IeltsQuizQuestion,
      IeltsQuestionChoice,
      IeltsQuestionAcceptedAnswer,
      IeltsLessonProgress,
      IeltsQuizAttempt,
      IeltsAttemptAnswer,
    ]),
  ],
  controllers: [
    IeltsCoursesController,
    IeltsCourseSectionsController,
    IeltsLessonsController,
    IeltsQuizzesController,
    IeltsQuizQuestionsController,
    IeltsLessonProgressController,
    IeltsQuizAttemptsController,
  ],
  providers: [IeltsCoursesService],
})
export class IeltsCoursesModule {}
