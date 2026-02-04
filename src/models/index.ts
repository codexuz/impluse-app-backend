// First, import all models without their associations
import { Course } from "../courses/entities/course.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { UserCourse } from "../user-course/entities/user-course.entity.js";
import { User } from "../users/entities/user.entity.js";
import { LessonContent } from "../lesson-content/entities/lesson-content.entity.js";

import { Choices } from "../exercise/entities/choices.js";
import { TypingExercise } from "../exercise/entities/typing_answers.js";
import { MatchingExercise } from "../exercise/entities/matching_pairs.js";
import { Questions } from "../exercise/entities/questions.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { GapFilling } from "../exercise/entities/gap_filling.js";

import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { GroupAssignedLesson } from "../group_assigned_lessons/entities/group_assigned_lesson.entity.js";
import { VocabularySet } from "../vocabulary_sets/entities/vocabulary_set.entity.js";
import { VocabularyItem } from "../vocabulary_items/entities/vocabulary_item.entity.js";
import { UnitVocabularySet } from "../unit_vocabulary_sets/entities/unit_vocabulary_set.entity.js";
import { LessonVocabularySet } from "../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js";
import { StudentVocabularyProgress } from "../student_vocabulary_progress/entities/student_vocabulary_progress.entity.js";
import { GroupHomework } from "../group_homeworks/entities/group_homework.entity.js";
import { HomeworkSubmission } from "../homework_submissions/entities/homework_submission.entity.js";
import { HomeworkSection } from "../homework_submissions/entities/homework_sections.entity.js";
import { GroupAssignedUnit } from "../group_assigned_units/entities/group_assigned_unit.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { Notifications } from "../notifications/entities/notification.entity.js";
import { LessonProgress } from "./../lesson_progress/entities/lesson_progress.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { AttendanceLog } from "../attendance/entities/attendance-log.entity.js";

import { Writing } from "../writing/entities/writing.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { PronunciationExercise } from "../pronunciation-exercise/entities/pronunciation-exercise.entity.js";
import { RoleScenario } from "../role-scenarios/entities/role-scenario.entity.js";
import { Ieltspart1Question } from "../ieltspart1-question/entities/ieltspart1-question.entity.js";
import { Ieltspart2Question } from "../ieltspart2-question/entities/ieltspart2-question.entity.js";
import { Ieltspart3Question } from "../ieltspart3-question/entities/ieltspart3-question.entity.js";

import { UserNotification } from "../user-notifications/entities/user-notification.entity.js";

import { Role } from "../users/entities/role.model.js";
import { Permission } from "../users/entities/permission.model.js";
import { UserRole } from "../users/entities/user-role.model.js";
import { RolePermission } from "../users/entities/role-permission.model.js";
import { UserSession } from "../users/entities/user-session.model.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { PaymentAction } from "../payment-actions/entities/payment-action.entity.js";
import { StudentBook } from "../student-book/entities/student-book.entity.js";
import { StudentBookUnit } from "../student-book-units/entities/student-book-unit.entity.js";
import { Movie } from "../movies/entities/movie.entity.js";

import { Video } from "../videos/entities/video.entity.js";
import { chatHistory } from "../ai-chat-bot/entities/ai-chat-bot.entity.js";
import { Lead } from "../leads/entities/lead.entity.js";
import { LeadTrialLesson } from "../lead-trial-lessons/entities/lead-trial-lesson.entity.js";
import { Exam } from "../exams/entities/exam.entity.js";
import { ExamResult } from "../exams/entities/exam_result.entity.js";

import { SupportSchedule } from "../support-schedules/entities/support-schedule.entity.js";
import { SupportBooking } from "../support-bookings/entities/support-booking.entity.js";
import { GroupChat } from "../group-chat/entities/group-chat.entity.js";
import { Messages } from "../group-chat/entities/messages.js";
import { GroupChatMembers } from "../group-chat/entities/chat_group_members.js";
import { SentenceBuild } from "../exercise/entities/sentence_build.js";
import { LessonSchedule } from "../lesson-schedules/entities/lesson-schedule.entity.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { CdIelts } from "../cd-ielts/entities/cd-ielt.entity.js";
import { CdRegister } from "../cd-ielts/entities/cd-register.entity.js";
import { Form } from "../forms/entities/form.entity.js";
import { Response as FormResponse } from "../forms/entities/response.entity.js";
import { SpeakingResponse } from "../speaking-response/entities/speaking-response.entity.js";
import { Audio } from "../audio/entities/audio.entity.js";
import { AudioComment } from "../audio/entities/comments.js";
import { AudioLike } from "../audio/entities/likes.js";
import { AudioJudge } from "../audio/entities/judge.js";
import { AudioTask } from "../audio/entities/audio-task.entity.js";
// Export the models array for Sequelize registration
import { Expense } from "../expenses/entities/expense.entity.js";
import { ExpensesCategory } from "../expenses/entities/expenses-category.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { StudentTransaction } from "../student-transaction/entities/student-transaction.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { Branch } from "../branches/entities/branch.entity.js";
import { CompensateLesson } from "../compensate-lessons/entities/compensate-lesson.entity.js";
import { CompensateTeacherWallet } from "../compensate-lessons/entities/compensate-teacher-wallet.entity.js";
import { IeltsTest } from "../ielts-tests/entities/ielts-test.entity.js";
import { IeltsReading } from "../ielts-tests/entities/ielts-reading.entity.js";
import { IeltsReadingPart } from "../ielts-tests/entities/ielts-reading-part.entity.js";
import { IeltsListening } from "../ielts-tests/entities/ielts-listening.entity.js";
import { IeltsListeningPart } from "../ielts-tests/entities/ielts-listening-part.entity.js";
import { IeltsWriting } from "../ielts-tests/entities/ielts-writing.entity.js";
import { IeltsWritingTask } from "../ielts-tests/entities/ielts-writing-task.entity.js";
import { IeltsAudio } from "../ielts-tests/entities/ielts-audio.entity.js";
import { IeltsQuestion } from "../ielts-tests/entities/ielts-question.entity.js";
import { IeltsQuestionContent } from "../ielts-tests/entities/ielts-question-content.entity.js";
import { IeltsQuestionOption } from "../ielts-tests/entities/ielts-question-option.entity.js";
import { IeltsMultipleChoiceQuestion } from "../ielts-tests/entities/ielts-multiple-choice-question.entity.js";
import { IeltsMultipleChoiceOption } from "../ielts-tests/entities/ielts-multiple-choice-option.entity.js";

export const Models = [
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  UserSession,
  Course,
  Exercise,
  Lesson,
  Unit,
  UserCourse,
  User,
  LessonContent,
  TypingExercise,
  GapFilling,
  SentenceBuild,
  Choices,
  Questions,
  MatchingExercise,
  GroupAssignedLesson,
  Group,
  GroupStudent,
  Attendance,
  AttendanceLog,
  VocabularySet,
  VocabularyItem,
  UnitVocabularySet,
  LessonVocabularySet,
  StudentVocabularyProgress,
  GroupHomework,
  HomeworkSubmission,
  HomeworkSection,
  GroupAssignedUnit,
  StudentProfile,
  StudentParent,
  Notifications,
  LessonProgress,
  Writing,
  Speaking,
  PronunciationExercise,
  RoleScenario,
  Ieltspart1Question,
  Ieltspart2Question,
  Ieltspart3Question,
  UserNotification,
  StudentPayment,
  PaymentAction,
  StudentBook,
  StudentBookUnit,
  Movie,
  Video,
  chatHistory,
  Lead,
  LeadTrialLesson,
  Exam,
  ExamResult,
  Messages,
  GroupChat,
  GroupChatMembers,
  LessonSchedule,
  NotificationToken,
  CdIelts,
  CdRegister,
  Form,
  FormResponse,
  Expense,
  ExpensesCategory,
  TeacherProfile,
  StudentWallet,
  TeacherWallet,
  StudentTransaction,
  TeacherTransaction,
  Audio,
  AudioComment,
  AudioLike,
  AudioJudge,
  AudioTask,
  Branch,
  CompensateLesson,
  CompensateTeacherWallet,
  IeltsTest,
  IeltsReading,
  IeltsReadingPart,
  IeltsListening,
  IeltsListeningPart,
  IeltsWriting,
  IeltsWritingTask,
  IeltsAudio,
  IeltsQuestion,
  IeltsQuestionContent,
  IeltsQuestionOption,
  IeltsMultipleChoiceQuestion,
  IeltsMultipleChoiceOption,
  SupportSchedule,
  SupportBooking,
];

// Define associations after all models are loaded
export function initializeAssociations() {
  // User associations
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
  });

  User.hasMany(UserSession, {
    foreignKey: "userId",
    as: "sessions",
  });

  // Role associations
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
  });

  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions",
  });

  // Permission associations
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles",
  });

  // UserRole associations
  UserRole.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  UserRole.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
  });

  // RolePermission associations
  RolePermission.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
  });

  RolePermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });

  // UserSession associations
  UserSession.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Course associations
  Course.hasMany(Unit, { foreignKey: "courseId", as: "units" });
  Course.hasMany(UserCourse, { foreignKey: "courseId", as: "userCourses" });
  Course.hasMany(User, { foreignKey: "level_id", as: "students" });
  Course.hasMany(Group, { foreignKey: "level_id", as: "groups" });

  // Module associations
  Unit.belongsTo(Course, { foreignKey: "courseId", as: "course" });
  Unit.hasMany(Lesson, { foreignKey: "moduleId", as: "lessons" });

  // Lesson associations
  Lesson.belongsTo(Unit, { foreignKey: "moduleId", as: "module" });
  Lesson.hasMany(Exercise, { foreignKey: "lessonId", as: "exercises" });
  Lesson.hasMany(LessonContent, {
    foreignKey: "lessonId",
    as: "theory",
  });
  Lesson.hasMany(Speaking, { foreignKey: "lessonId", as: "speaking" });
  Speaking.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

  Lesson.hasMany(Writing, { foreignKey: "lessonId", as: "writing" });
  Writing.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

  // Exercise associations
  Exercise.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

  // Questions associations
  Exercise.hasMany(Questions, {
    foreignKey: "exercise_id",
    as: "questions",
  });

  Questions.belongsTo(Exercise, {
    foreignKey: "exercise_id",
    as: "exercise",
  });

  // MultipleChoiceOption associations
  Questions.hasMany(Choices, {
    foreignKey: "question_id",
    as: "choices",
  });

  Choices.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
  });

  // Typing associations
  Questions.hasMany(TypingExercise, {
    foreignKey: "question_id",
    as: "typing_exercise",
  });

  TypingExercise.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
  });

  // Matching associations
  Questions.hasMany(MatchingExercise, {
    foreignKey: "question_id",
    as: "matching_pairs",
  });

  MatchingExercise.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
  });

  //GapFilling associations
  Questions.hasMany(GapFilling, {
    foreignKey: "question_id",
    as: "gap_filling",
  });

  GapFilling.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
  });

  // SentenceBuild associations
  Questions.hasMany(SentenceBuild, {
    foreignKey: "question_id",
    as: "sentence_build",
  });

  SentenceBuild.belongsTo(Questions, {
    foreignKey: "question_id",
    as: "question",
  });

  // UserCourse associations
  UserCourse.belongsTo(User, { foreignKey: "userId", as: "user" });
  UserCourse.belongsTo(Course, { foreignKey: "courseId", as: "course" });

  // User associations
  User.hasMany(UserCourse, { foreignKey: "userId", as: "userCourses" });
  User.hasMany(Group, { foreignKey: "teacher_id", as: "teachingGroups" });
  User.belongsTo(Course, { foreignKey: "level_id", as: "level" });

  // LessonContent associations
  LessonContent.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });

  //Group associations
  Group.belongsToMany(User, {
    through: GroupStudent,
    foreignKey: "group_id",
    otherKey: "student_id",
    as: "students",
  });

  Group.belongsTo(Course, { foreignKey: "level_id", as: "level" });

  Group.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });

  Group.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

  User.belongsToMany(Group, {
    through: GroupStudent,
    foreignKey: "student_id",
    otherKey: "group_id",
    as: "groups",
  });

  // GroupAssignedLesson associations
  GroupAssignedLesson.belongsTo(User, {
    foreignKey: "granted_by",
    as: "teacher",
  });
  GroupAssignedLesson.belongsTo(Lesson, {
    foreignKey: "lesson_id",
    as: "lesson",
  });
  GroupAssignedLesson.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  GroupAssignedLesson.belongsTo(GroupAssignedUnit, {
    foreignKey: "group_assigned_unit_id",
    as: "group_assigned_unit",
  });

  User.hasMany(GroupAssignedLesson, {
    foreignKey: "granted_by",
    as: "grantedLessons",
  });
  Lesson.hasMany(GroupAssignedLesson, {
    foreignKey: "lesson_id",
    as: "lessonAccesses",
  });
  Group.hasMany(GroupAssignedLesson, {
    foreignKey: "group_id",
    as: "lessonAccesses",
  });
  GroupAssignedUnit.hasMany(GroupAssignedLesson, {
    foreignKey: "group_assigned_unit_id",
    as: "lessons",
  });

  // Attendance Associations
  Group.hasMany(Attendance, { foreignKey: "group_id", as: "group_attendance" });
  User.hasMany(Attendance, {
    foreignKey: "student_id",
    as: "student_attendance",
  });
  User.hasMany(Attendance, {
    foreignKey: "teacher_id",
    as: "marked_attendance",
  });

  Attendance.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  Attendance.belongsTo(User, { foreignKey: "student_id", as: "student" });
  Attendance.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
  Attendance.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });
  Attendance.hasMany(AttendanceLog, {
    foreignKey: "attendance_id",
    as: "logs",
  });

  // AttendanceLog Associations
  AttendanceLog.belongsTo(Attendance, {
    foreignKey: "attendance_id",
    as: "attendance",
  });
  AttendanceLog.belongsTo(User, { foreignKey: "student_id", as: "student" });
  AttendanceLog.belongsTo(User, { foreignKey: "marked_by", as: "marker" });
  User.hasMany(AttendanceLog, {
    foreignKey: "marked_by",
    as: "attendance_logs_marked",
  });
  User.hasMany(AttendanceLog, {
    foreignKey: "student_id",
    as: "attendance_logs",
  });

  // CompensateLesson Associations
  CompensateLesson.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
  CompensateLesson.belongsTo(User, { foreignKey: "student_id", as: "student" });
  CompensateLesson.belongsTo(Attendance, {
    foreignKey: "attendance_id",
    as: "attendance",
  });

  User.hasMany(CompensateLesson, {
    foreignKey: "teacher_id",
    as: "teacher_compensate_lessons",
  });
  User.hasMany(CompensateLesson, {
    foreignKey: "student_id",
    as: "student_compensate_lessons",
  });
  Attendance.hasMany(CompensateLesson, {
    foreignKey: "attendance_id",
    as: "compensate_lessons",
  });

  // CompensateTeacherWallet Associations
  CompensateTeacherWallet.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher",
  });
  CompensateTeacherWallet.belongsTo(CompensateLesson, {
    foreignKey: "compensate_lesson_id",
    as: "compensateLesson",
  });

  User.hasMany(CompensateTeacherWallet, {
    foreignKey: "teacher_id",
    as: "compensate_teacher_wallets",
  });
  CompensateLesson.hasMany(CompensateTeacherWallet, {
    foreignKey: "compensate_lesson_id",
    as: "teacher_wallets",
  });

  //VocabularySet Associations
  Course.hasMany(VocabularySet, {
    foreignKey: "course_id",
    as: "vocabulary_sets",
  });
  VocabularySet.belongsTo(Course, { foreignKey: "course_id", as: "course" });

  //VocabularyItem Associations
  VocabularySet.hasMany(VocabularyItem, {
    foreignKey: "set_id",
    as: "vocabulary_items",
  });
  VocabularyItem.belongsTo(VocabularySet, {
    foreignKey: "set_id",
    as: "vocabulary_set",
  });

  //UnitVocabularySet Associations
  Unit.hasMany(UnitVocabularySet, {
    foreignKey: "unit_id",
    as: "unit_vocabulary_sets",
  });
  UnitVocabularySet.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });
  VocabularyItem.hasMany(UnitVocabularySet, {
    foreignKey: "vocabulary_item_id",
    as: "unit_vocabulary_sets",
  });
  UnitVocabularySet.belongsTo(VocabularyItem, {
    foreignKey: "vocabulary_item_id",
    as: "vocabulary_sets",
  });

  //LessonVocabularySet Associations
  Lesson.hasMany(LessonVocabularySet, {
    foreignKey: "lesson_id",
    as: "lesson_vocabulary",
  });
  LessonVocabularySet.belongsTo(Lesson, {
    foreignKey: "lesson_id",
    as: "lesson",
  });

  VocabularyItem.hasMany(LessonVocabularySet, {
    foreignKey: "vocabulary_item_id",
    as: "lesson_vocabulary",
  });
  LessonVocabularySet.belongsTo(VocabularyItem, {
    foreignKey: "vocabulary_item_id",
    as: "vocabulary_set",
  });

  //StudentVocabularyProgress Associations
  User.hasMany(StudentVocabularyProgress, {
    foreignKey: "student_id",
    as: "student_vocabulary_progress",
  });
  StudentVocabularyProgress.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });
  VocabularyItem.hasMany(StudentVocabularyProgress, {
    foreignKey: "vocabulary_item_id",
    as: "student_vocabulary_progress",
  });
  StudentVocabularyProgress.belongsTo(VocabularyItem, {
    foreignKey: "vocabulary_item_id",
    as: "vocabulary_item",
  });

  //GroupHomework Associations
  Group.hasMany(GroupHomework, {
    foreignKey: "group_id",
    as: "group_homework",
  });
  GroupHomework.belongsTo(Group, { foreignKey: "group_id", as: "group" });

  Lesson.hasMany(GroupHomework, {
    foreignKey: "lesson_id",
    as: "group_homework",
  });
  GroupHomework.belongsTo(Lesson, { foreignKey: "lesson_id", as: "lesson" });
  User.hasMany(GroupHomework, {
    foreignKey: "teacher_id",
    as: "group_homework",
  });
  GroupHomework.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });

  //HomeworkSubmission Associations
  User.hasMany(HomeworkSubmission, {
    foreignKey: "student_id",
    as: "homework_submission",
  });
  HomeworkSubmission.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });
  GroupHomework.hasMany(HomeworkSubmission, {
    foreignKey: "homework_id",
    as: "homework_submission",
  });
  HomeworkSubmission.belongsTo(GroupHomework, {
    foreignKey: "homework_id",
    as: "homework",
  });

  Lesson.hasMany(HomeworkSubmission, {
    foreignKey: "lesson_id",
    as: "homework_submissions",
  });
  HomeworkSubmission.belongsTo(Lesson, {
    foreignKey: "lesson_id",
    as: "lesson",
  });

  // HomeworkSection Associations
  HomeworkSubmission.hasMany(HomeworkSection, {
    foreignKey: "submission_id",
    as: "sections",
  });
  HomeworkSection.belongsTo(HomeworkSubmission, {
    foreignKey: "submission_id",
    as: "submission",
  });

  Exercise.hasMany(HomeworkSection, {
    foreignKey: "exercise_id",
    as: "homework_sections",
  });
  HomeworkSection.belongsTo(Exercise, {
    foreignKey: "exercise_id",
    as: "exercise",
  });

  Speaking.hasMany(HomeworkSection, {
    foreignKey: "speaking_id",
    as: "homework_sections",
  });
  HomeworkSection.belongsTo(Speaking, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  //GroupAssignedUnit Associations
  Group.hasMany(GroupAssignedUnit, {
    foreignKey: "group_id",
    as: "group_assigned_units",
  });
  GroupAssignedUnit.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  User.hasMany(GroupAssignedUnit, {
    foreignKey: "teacher_id",
    as: "group_assigned_units",
  });
  GroupAssignedUnit.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher",
  });
  Unit.hasMany(GroupAssignedUnit, {
    foreignKey: "unit_id",
    as: "group_assigned_units",
  });
  GroupAssignedUnit.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });

  //Notifications Associations
  User.belongsToMany(Notifications, {
    through: UserNotification,
    foreignKey: "user_id",
  });

  Notifications.belongsToMany(User, {
    through: UserNotification,
    foreignKey: "notification_id",
  });

  Notifications.hasMany(UserNotification, {
    foreignKey: "notification_id",
    as: "user_notifications",
  });

  UserNotification.belongsTo(Notifications, {
    foreignKey: "notification_id",
    as: "notification",
  });

  //LessonProgress Assciations
  User.belongsToMany(Lesson, {
    through: LessonProgress,
    foreignKey: "student_id",
  });

  Lesson.belongsToMany(User, {
    through: LessonProgress,
    foreignKey: "lesson_id",
  });

  // Speaking associations
  Speaking.hasMany(PronunciationExercise, {
    foreignKey: "speaking_id",
    as: "pronunciationExercise",
  });
  PronunciationExercise.belongsTo(Exercise, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  Speaking.hasMany(RoleScenario, {
    foreignKey: "speaking_id",
    as: "role_scenario",
  });
  RoleScenario.belongsTo(Exercise, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  Speaking.hasMany(Ieltspart1Question, {
    foreignKey: "speaking_id",
    as: "part1_questions",
  });
  Ieltspart1Question.belongsTo(Exercise, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  Speaking.hasMany(Ieltspart2Question, {
    foreignKey: "speaking_id",
    as: "part2_questions",
  });
  Ieltspart2Question.belongsTo(Exercise, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  Speaking.hasMany(Ieltspart3Question, {
    foreignKey: "speaking_id",
    as: "part3_questions",
  });
  Ieltspart3Question.belongsTo(Exercise, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  //StudentProfile Associations
  User.hasOne(StudentProfile, { foreignKey: "user_id", as: "student_profile" });
  StudentProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });

  //StudentParent Associations
  User.hasMany(StudentParent, {
    foreignKey: "student_id",
    as: "student_parents",
  });
  StudentParent.belongsTo(User, { foreignKey: "student_id", as: "student" });

  // StudentPayment Associations
  User.hasMany(StudentPayment, { foreignKey: "student_id", as: "payments" });
  StudentPayment.belongsTo(User, { foreignKey: "student_id", as: "student" });
  User.hasMany(StudentPayment, {
    foreignKey: "manager_id",
    as: "managed_payments",
  });
  StudentPayment.belongsTo(User, { foreignKey: "manager_id", as: "manager" });

  StudentPayment.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

  // StudentBook Associations
  Course.hasMany(StudentBook, { foreignKey: "level_id", as: "student_books" });
  StudentBook.belongsTo(Course, { foreignKey: "level_id", as: "level" });

  // StudentBookUnit Associations
  StudentBook.hasMany(StudentBookUnit, {
    foreignKey: "student_book_id",
    as: "units",
  });
  StudentBookUnit.belongsTo(StudentBook, {
    foreignKey: "student_book_id",
    as: "student_book",
  });
  Unit.hasMany(StudentBookUnit, {
    foreignKey: "unit_id",
    as: "student_book_units",
  });
  StudentBookUnit.belongsTo(Unit, { foreignKey: "unit_id", as: "unit" });

  // Course to Lead: One-to-Many
  Course.hasMany(Lead, {
    foreignKey: "course_id",
    as: "leads",
  });

  Lead.belongsTo(Course, {
    foreignKey: "course_id",
    as: "course",
  });

  Lead.belongsTo(Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  // Lead to User through LeadTrialLesson
  Lead.hasOne(LeadTrialLesson, {
    foreignKey: "lead_id",
    as: "trial_lesson",
  });

  User.hasMany(LeadTrialLesson, {
    foreignKey: "teacher_id",
    as: "trial_lessons",
  });

  LeadTrialLesson.belongsTo(Lead, {
    foreignKey: "lead_id",
    as: "leadData",
  });

  LeadTrialLesson.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacherData",
  });

  // chatHistory associations
  User.hasMany(chatHistory, {
    foreignKey: "userId",
    as: "chat_histories",
  });
  chatHistory.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Branch associations
  User.hasMany(Branch, {
    foreignKey: "owner_id",
    as: "branches",
  });

  User.belongsTo(Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  Branch.belongsTo(User, {
    foreignKey: "owner_id",
    as: "owner",
  });

  Branch.hasMany(User, {
    foreignKey: "branch_id",
    as: "users",
  });

  Branch.hasMany(Attendance, {
    foreignKey: "branch_id",
    as: "attendances",
  });

  Branch.hasMany(Exam, {
    foreignKey: "branch_id",
    as: "exams",
  });

  Branch.hasMany(Group, {
    foreignKey: "branch_id",
    as: "groups",
  });

  Branch.hasMany(Lead, {
    foreignKey: "branch_id",
    as: "leads",
  });

  Branch.hasMany(PaymentAction, {
    foreignKey: "branch_id",
    as: "payment_actions",
  });

  Branch.hasMany(StudentPayment, {
    foreignKey: "branch_id",
    as: "student_payments",
  });

  Branch.hasMany(TeacherProfile, {
    foreignKey: "branch_id",
    as: "teacher_profiles",
  });

  Branch.hasMany(TeacherTransaction, {
    foreignKey: "branch_id",
    as: "teacher_transactions",
  });

  // Exam associations
  Group.hasMany(Exam, {
    foreignKey: "group_id",
    as: "exams",
  });
  Exam.belongsTo(Group, { foreignKey: "group_id", as: "group" });
  Exam.belongsTo(Branch, { foreignKey: "branch_id", as: "branch" });

  Exam.hasMany(ExamResult, {
    foreignKey: "exam_id",
    as: "results",
  });
  ExamResult.belongsTo(Exam, {
    foreignKey: "exam_id",
    as: "exam",
  });

  User.hasMany(ExamResult, {
    foreignKey: "student_id",
    as: "exam_results",
  });
  ExamResult.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  // SupportSchedule associations
  User.hasMany(SupportSchedule, {
    foreignKey: "support_teacher_id",
    as: "support_schedules",
  });

  SupportSchedule.belongsTo(User, {
    foreignKey: "support_teacher_id",
    as: "teacher",
  });

  Group.hasMany(SupportSchedule, {
    foreignKey: "group_id",
    as: "support_schedules",
  });

  SupportSchedule.belongsTo(Group, {
    foreignKey: "group_id",
    as: "group",
  });

  // SupportBooking associations
  User.hasMany(SupportBooking, {
    foreignKey: "student_id",
    as: "support_bookings",
  });
  SupportBooking.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  User.hasMany(SupportBooking, {
    foreignKey: "support_teacher_id",
    as: "teacher_bookings",
  });

  SupportBooking.belongsTo(User, {
    foreignKey: "support_teacher_id",
    as: "teacher",
  });

  SupportSchedule.hasMany(SupportBooking, {
    foreignKey: "schedule_id",
    as: "bookings",
  });
  SupportBooking.belongsTo(SupportSchedule, {
    foreignKey: "schedule_id",
    as: "schedule",
  });

  // GroupChatMembers associations
  Group.hasMany(GroupChatMembers, {
    foreignKey: "chat_group_id",
    as: "group_chats",
  });
  GroupChatMembers.belongsTo(Group, {
    foreignKey: "chat_group_id",
    as: "group",
  });

  User.hasMany(GroupChatMembers, {
    foreignKey: "user_id",
    as: "group_chats",
  });

  GroupChatMembers.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // Messages associations
  GroupChat.hasMany(Messages, {
    foreignKey: "chat_group_id",
    as: "messages",
  });
  Messages.belongsTo(GroupChat, {
    foreignKey: "chat_group_id",
    as: "group_chat",
  });

  User.hasMany(Messages, {
    foreignKey: "sender_id",
    as: "sent_messages",
  });

  Messages.belongsTo(User, {
    foreignKey: "sender_id",
    as: "sender",
  });

  // LessonSchedule associations
  Group.hasMany(LessonSchedule, {
    foreignKey: "group_id",
    as: "lesson_schedules",
  });
  LessonSchedule.belongsTo(Group, {
    foreignKey: "group_id",
    as: "group",
  });

  // NotificationToken associations
  User.hasMany(NotificationToken, {
    foreignKey: "user_id",
    as: "notification_tokens",
  });
  NotificationToken.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // CdIelts associations
  CdIelts.hasMany(CdRegister, {
    foreignKey: "cd_test_id",
    as: "registrations",
  });
  CdRegister.belongsTo(CdIelts, {
    foreignKey: "cd_test_id",
    as: "cd_test",
  });

  User.hasMany(CdRegister, {
    foreignKey: "student_id",
    as: "cd_registrations",
  });
  CdRegister.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  // Form associations
  Form.hasMany(FormResponse, {
    foreignKey: "form_id",
    as: "responses",
  });
  FormResponse.belongsTo(Form, {
    foreignKey: "form_id",
    as: "form",
  });

  // SpeakingResponse associations
  Speaking.hasMany(SpeakingResponse, {
    foreignKey: "speaking_id",
    as: "responses",
  });
  SpeakingResponse.belongsTo(Speaking, {
    foreignKey: "speaking_id",
    as: "speaking",
  });

  User.hasMany(SpeakingResponse, {
    foreignKey: "student_id",
    as: "speaking_responses",
  });
  SpeakingResponse.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  // Expense associations
  ExpensesCategory.hasMany(Expense, {
    foreignKey: "category_id",
    as: "expenses",
  });
  Expense.belongsTo(ExpensesCategory, {
    foreignKey: "category_id",
    as: "category",
  });

  User.hasMany(Expense, {
    foreignKey: "reported_by",
    as: "reported_expenses",
  });
  Expense.belongsTo(User, {
    foreignKey: "reported_by",
    as: "reporter",
  });

  User.hasMany(Expense, {
    foreignKey: "teacher_id",
    as: "teacher_expenses",
  });
  Expense.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher",
  });

  // StudentWallet associations
  User.hasOne(StudentWallet, {
    foreignKey: "student_id",
    as: "student_wallet",
  });
  StudentWallet.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  // TeacherWallet associations
  User.hasOne(TeacherWallet, {
    foreignKey: "teacher_id",
    as: "teacher_wallet",
  });
  TeacherWallet.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher",
  });

  // TeacherProfile associations
  User.hasOne(TeacherProfile, {
    foreignKey: "user_id",
    as: "teacher_profile",
  });
  TeacherProfile.belongsTo(User, {
    foreignKey: "user_id",
    as: "teacher",
  });

  TeacherProfile.belongsTo(Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  // StudentTransaction associations
  User.hasMany(StudentTransaction, {
    foreignKey: "student_id",
    as: "student_transactions",
  });
  StudentTransaction.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  // TeacherTransaction associations
  User.hasMany(TeacherTransaction, {
    foreignKey: "teacher_id",
    as: "teacher_transactions",
  });
  TeacherTransaction.belongsTo(User, {
    foreignKey: "teacher_id",
    as: "teacher",
  });
  User.hasMany(TeacherTransaction, {
    foreignKey: "student_id",
    as: "related_teacher_transactions",
  });
  TeacherTransaction.belongsTo(User, {
    foreignKey: "student_id",
    as: "student",
  });

  TeacherTransaction.belongsTo(Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  // PaymentAction associations
  StudentPayment.hasMany(PaymentAction, {
    foreignKey: "payment_id",
    as: "actions",
  });
  PaymentAction.belongsTo(StudentPayment, {
    foreignKey: "payment_id",
    as: "payment",
  });

  User.hasMany(PaymentAction, {
    foreignKey: "manager_id",
    as: "payment_actions",
  });
  PaymentAction.belongsTo(User, {
    foreignKey: "manager_id",
    as: "manager",
  });

  PaymentAction.belongsTo(Branch, {
    foreignKey: "branch_id",
    as: "branch",
  });

  // Audio associations
  User.hasMany(Audio, {
    foreignKey: "studentId",
    as: "audios",
  });
  Audio.belongsTo(User, {
    foreignKey: "studentId",
    as: "student",
  });

  AudioTask.hasMany(Audio, {
    foreignKey: "taskId",
    as: "audios",
  });
  Audio.belongsTo(AudioTask, {
    foreignKey: "taskId",
    as: "task",
  });

  // AudioComment associations
  Audio.hasMany(AudioComment, {
    foreignKey: "audioId",
    as: "comments",
  });
  AudioComment.belongsTo(Audio, {
    foreignKey: "audioId",
    as: "audio",
  });

  User.hasMany(AudioComment, {
    foreignKey: "userId",
    as: "audio_comments",
  });
  AudioComment.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // AudioLike associations
  Audio.hasMany(AudioLike, {
    foreignKey: "audioId",
    as: "likes",
  });
  AudioLike.belongsTo(Audio, {
    foreignKey: "audioId",
    as: "audio",
  });

  User.hasMany(AudioLike, {
    foreignKey: "userId",
    as: "audio_likes",
  });
  AudioLike.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // AudioJudge associations
  Audio.hasMany(AudioJudge, {
    foreignKey: "audioId",
    as: "judges",
  });
  AudioJudge.belongsTo(Audio, {
    foreignKey: "audioId",
    as: "audio",
  });

  User.hasMany(AudioJudge, {
    foreignKey: "judgeUserId",
    as: "audio_judgments",
  });
  AudioJudge.belongsTo(User, {
    foreignKey: "judgeUserId",
    as: "judge",
  });

  // IELTS Test associations
  IeltsTest.belongsTo(User, {
    foreignKey: "created_by",
    as: "creator",
  });

  // IeltsReading associations
  IeltsReading.belongsTo(IeltsTest, {
    foreignKey: "test_id",
    as: "test",
  });
  IeltsReading.hasMany(IeltsReadingPart, {
    foreignKey: "reading_id",
    as: "parts",
  });

  // IeltsListening associations
  IeltsListening.belongsTo(IeltsTest, {
    foreignKey: "test_id",
    as: "test",
  });
  IeltsListening.hasMany(IeltsListeningPart, {
    foreignKey: "listening_id",
    as: "parts",
  });

  // IeltsWriting associations
  IeltsWriting.belongsTo(IeltsTest, {
    foreignKey: "test_id",
    as: "test",
  });
  IeltsWriting.hasMany(IeltsWritingTask, {
    foreignKey: "writing_id",
    as: "tasks",
  });

  // IeltsReadingPart associations
  IeltsReadingPart.belongsTo(IeltsReading, {
    foreignKey: "reading_id",
    as: "reading",
  });
  IeltsReadingPart.hasMany(IeltsQuestion, {
    foreignKey: "reading_part_id",
    as: "questions",
  });

  // IeltsListeningPart associations
  IeltsListeningPart.belongsTo(IeltsListening, {
    foreignKey: "listening_id",
    as: "listening",
  });
  IeltsListeningPart.hasMany(IeltsQuestion, {
    foreignKey: "listening_part_id",
    as: "questions",
  });
  IeltsListeningPart.belongsTo(IeltsAudio, {
    foreignKey: "audio_id",
    as: "audio",
  });

  // IeltsWritingTask associations
  IeltsWritingTask.belongsTo(IeltsWriting, {
    foreignKey: "writing_id",
    as: "writing",
  });

  // IeltsQuestion associations
  IeltsQuestion.belongsTo(IeltsReadingPart, {
    foreignKey: "reading_part_id",
    as: "readingPart",
  });
  IeltsQuestion.belongsTo(IeltsListeningPart, {
    foreignKey: "listening_part_id",
    as: "listeningPart",
  });
  IeltsQuestion.hasMany(IeltsQuestionContent, {
    foreignKey: "question_id",
    as: "contents",
  });

  // IeltsQuestionContent associations
  IeltsQuestionContent.belongsTo(IeltsQuestion, {
    foreignKey: "question_id",
    as: "question",
  });
  IeltsQuestionContent.hasMany(IeltsQuestionOption, {
    foreignKey: "question_content_id",
    as: "options",
  });
  IeltsQuestionContent.hasMany(IeltsMultipleChoiceQuestion, {
    foreignKey: "question_content_id",
    as: "multipleChoiceQuestions",
  });

  // IeltsQuestionOption associations
  IeltsQuestionOption.belongsTo(IeltsQuestionContent, {
    foreignKey: "question_content_id",
    as: "questionContent",
  });

  // IeltsMultipleChoiceQuestion associations
  IeltsMultipleChoiceQuestion.belongsTo(IeltsQuestionContent, {
    foreignKey: "question_content_id",
    as: "questionContent",
  });
  IeltsMultipleChoiceQuestion.hasMany(IeltsMultipleChoiceOption, {
    foreignKey: "multiple_choice_question_id",
    as: "options",
  });

  // IeltsMultipleChoiceOption associations
  IeltsMultipleChoiceOption.belongsTo(IeltsMultipleChoiceQuestion, {
    foreignKey: "multiple_choice_question_id",
    as: "multipleChoiceQuestion",
  });
}
