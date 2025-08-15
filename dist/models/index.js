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
import { GroupAssignedUnit } from "../group_assigned_units/entities/group_assigned_unit.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { Notifications } from "../notifications/entities/notification.entity.js";
import { LessonProgress } from "./../lesson_progress/entities/lesson_progress.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
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
    VocabularySet,
    VocabularyItem,
    UnitVocabularySet,
    LessonVocabularySet,
    StudentVocabularyProgress,
    GroupHomework,
    HomeworkSubmission,
    GroupAssignedUnit,
    StudentProfile,
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
];
export function initializeAssociations() {
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
    Permission.belongsToMany(Role, {
        through: RolePermission,
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "roles",
    });
    UserRole.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });
    UserRole.belongsTo(Role, {
        foreignKey: "roleId",
        as: "role",
    });
    RolePermission.belongsTo(Role, {
        foreignKey: "roleId",
        as: "role",
    });
    RolePermission.belongsTo(Permission, {
        foreignKey: "permissionId",
        as: "permission",
    });
    UserSession.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });
    Course.hasMany(Unit, { foreignKey: "courseId", as: "units" });
    Course.hasMany(UserCourse, { foreignKey: "courseId", as: "userCourses" });
    Course.hasMany(User, { foreignKey: "level_id", as: "students" });
    Course.hasMany(Group, { foreignKey: "level_id", as: "groups" });
    Unit.belongsTo(Course, { foreignKey: "courseId", as: "course" });
    Unit.hasMany(Lesson, { foreignKey: "moduleId", as: "lessons" });
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
    Exercise.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });
    Exercise.hasMany(Questions, {
        foreignKey: "exercise_id",
        as: "questions",
    });
    Questions.belongsTo(Exercise, {
        foreignKey: "exercise_id",
        as: "exercise",
    });
    Questions.hasMany(Choices, {
        foreignKey: "question_id",
        as: "choices",
    });
    Choices.belongsTo(Questions, {
        foreignKey: "question_id",
        as: "question",
    });
    Questions.hasMany(TypingExercise, {
        foreignKey: "question_id",
        as: "typing_exercise"
    });
    TypingExercise.belongsTo(Questions, {
        foreignKey: "question_id",
        as: "question"
    });
    Questions.hasMany(MatchingExercise, {
        foreignKey: "question_id",
        as: "matching_pairs"
    });
    MatchingExercise.belongsTo(Questions, {
        foreignKey: "question_id",
        as: "question"
    });
    Questions.hasMany(GapFilling, {
        foreignKey: "question_id",
        as: "gap_filling"
    });
    GapFilling.belongsTo(Questions, {
        foreignKey: "question_id",
        as: "question"
    });
    Questions.hasMany(SentenceBuild, {
        foreignKey: "question_id",
        as: "sentence_build"
    });
    SentenceBuild.belongsTo(Questions, {
        foreignKey: "question_id",
        as: "question"
    });
    UserCourse.belongsTo(User, { foreignKey: "userId", as: "user" });
    UserCourse.belongsTo(Course, { foreignKey: "courseId", as: "course" });
    User.hasMany(UserCourse, { foreignKey: "userId", as: "userCourses" });
    User.hasMany(Group, { foreignKey: "teacher_id", as: "teachingGroups" });
    User.belongsTo(Course, { foreignKey: "level_id", as: "level" });
    LessonContent.belongsTo(Lesson, { foreignKey: "lessonId", as: "lesson" });
    Group.belongsToMany(User, {
        through: GroupStudent,
        foreignKey: "group_id",
        otherKey: "student_id",
        as: "students",
    });
    Group.belongsTo(Course, { foreignKey: "level_id", as: "level" });
    Group.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });
    User.belongsToMany(Group, {
        through: GroupStudent,
        foreignKey: "student_id",
        otherKey: "group_id",
        as: "groups",
    });
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
    Course.hasMany(VocabularySet, {
        foreignKey: "course_id",
        as: "vocabulary_sets",
    });
    VocabularySet.belongsTo(Course, { foreignKey: "course_id", as: "course" });
    VocabularySet.hasMany(VocabularyItem, {
        foreignKey: "set_id",
        as: "vocabulary_items",
    });
    VocabularyItem.belongsTo(VocabularySet, {
        foreignKey: "set_id",
        as: "vocabulary_set",
    });
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
    Exercise.hasMany(HomeworkSubmission, {
        foreignKey: "exercise_id",
        as: "homework_submissions",
    });
    HomeworkSubmission.belongsTo(Exercise, {
        foreignKey: "exercise_id",
        as: "exercise",
    });
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
    User.belongsToMany(Lesson, {
        through: LessonProgress,
        foreignKey: "student_id",
    });
    Lesson.belongsToMany(User, {
        through: LessonProgress,
        foreignKey: "lesson_id",
    });
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
    User.hasOne(StudentProfile, { foreignKey: "user_id", as: "student_profile" });
    StudentProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });
    User.hasMany(StudentPayment, { foreignKey: "student_id", as: "payments" });
    StudentPayment.belongsTo(User, { foreignKey: "student_id", as: "student" });
    User.hasMany(StudentPayment, {
        foreignKey: "manager_id",
        as: "managed_payments",
    });
    StudentPayment.belongsTo(User, { foreignKey: "manager_id", as: "manager" });
    Course.hasMany(StudentBook, { foreignKey: "level_id", as: "student_books" });
    StudentBook.belongsTo(Course, { foreignKey: "level_id", as: "level" });
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
    Course.hasMany(Lead, {
        foreignKey: "course_id",
        as: "leads",
    });
    Lead.belongsTo(Course, {
        foreignKey: "course_id",
        as: "course",
    });
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
        as: "lead",
    });
    LeadTrialLesson.belongsTo(User, {
        foreignKey: "teacher_id",
        as: "teacher",
    });
    User.hasMany(chatHistory, {
        foreignKey: "userId",
        as: "chat_histories",
    });
    chatHistory.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });
    Group.hasMany(Exam, {
        foreignKey: "group_id",
        as: "exams",
    });
    Exam.belongsTo(Group, { foreignKey: "group_id", as: "group" });
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
}
//# sourceMappingURL=index.js.map