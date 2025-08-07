import { AdminJSOptions } from "adminjs";
import passwordsFeature from '@adminjs/passwords';
import * as bcrypt from 'bcrypt';

import { componentLoader } from "./component-loader.js";
import importExportFeature from "@adminjs/import-export";
import { Course } from "../courses/entities/course.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { UserCourse } from "../user-course/entities/user-course.entity.js";
import { User } from "../users/entities/user.entity.js";
import { LessonContent } from "../lesson-content/entities/lesson-content.entity.js";
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


import { Role } from '../users/entities/role.model.js';
import { Permission } from '../users/entities/permission.model.js';
import { UserRole } from '../users/entities/user-role.model.js';
import { RolePermission } from '../users/entities/role-permission.model.js';

import { Movie } from "../movies/entities/movie.entity.js";
import { Video } from "../videos/entities/video.entity.js";
import { chatHistory } from "../ai-chat-bot/entities/ai-chat-bot.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";  
import { Exam } from "../exams/entities/exam.entity.js";
import { Book } from "../books/entities/book.entity.js";
import { StudentBook } from "../student-book/entities/student-book.entity.js";
import { StudentBookUnit } from "../student-book-units/entities/student-book-unit.entity.js";

const options: AdminJSOptions = {
  rootPath: "/admin",
  componentLoader,
  branding: {
    companyName: 'Impulse Study',
    logo: "https://crm.impulselc.uz/logo.png",
    withMadeWithLove: false
  },
  resources: [
  {
    resource: Course,
    options: { name: 'Courses', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Exam,
    options: { name: 'Exam', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Group,
    options: { name: 'Groups', navigation: 'Users & Groups' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: GroupStudent,
    options: { name: 'Group Students', navigation: 'Users & Groups' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: GroupAssignedUnit,
    options: { name: 'Assigned Units', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: GroupAssignedLesson,
    options: { name: 'Assigned Lessons', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Attendance,
    options: { name: 'Attendance', navigation: 'Progress Tracking' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Unit,
    options: { name: 'Units', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Lesson,
    options: { name: 'Lessons', navigation: 'Curriculum' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: LessonContent,
    options: { name: 'Lesson Content', navigation: 'Curriculum', properties: { content: { type: "richtext" } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Exercise,
    options: { name: 'Exercises', navigation: 'Exercises' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Writing,
    options: { name: 'Writing', navigation: 'IELTS', properties: { question: { type: "textarea", props: { row: 50 } }, sample_answer: { type: "richtext" } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Speaking,
    options: { name: 'Speaking', navigation: 'IELTS', properties: { topic: { isTitle: true } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: PronunciationExercise,
    options: { name: 'Pronunciation', navigation: 'Speaking Practice' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: RoleScenario,
    options: { name: 'Role Scenarios', navigation: 'Speaking Practice' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Ieltspart1Question,
    options: { name: 'IELTS Part 1', navigation: 'IELTS', properties: { question: { type: "textarea", props: { rows: 10 } }, sample_answer: { type: "richtext" } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Ieltspart2Question,
    options: { name: 'IELTS Part 2', navigation: 'IELTS', properties: { question: { type: "textarea", props: { rows: 10 } }, sample_answer: { type: "richtext" } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Ieltspart3Question,
    options: { name: 'IELTS Part 3', navigation: 'IELTS', properties: { question: { type: "textarea", props: { rows: 10 } }, sample_answer: { type: "richtext" } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: UserCourse,
    options: { name: 'User Courses', navigation: 'Users & Groups' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: User,
    options: { name: 'Users', navigation: 'Users & Auth' },
    features: [
      importExportFeature({ componentLoader }),
      passwordsFeature({
        componentLoader,
        properties: {
          password: 'password_hash',
        },
        hash: async (password: string) => {
          const saltRounds = 10;
          return await bcrypt.hash(password, saltRounds);
        },
      })
    ],
  },
  {
    resource: StudentProfile,
    options: { name: 'Student Profiles', navigation: 'Users & Auth' },
    features: [
      importExportFeature({ componentLoader })],
  },
  {
    resource: UserRole,
    options: { name: 'Users', navigation: 'Users & Auth' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Role,
    options: { name: 'Users', navigation: 'Users & Auth' },
    features: [importExportFeature({ componentLoader })],
  },
   {
    resource: Permission,
    options: { name: 'Users', navigation: 'Users & Auth' },
    features: [importExportFeature({ componentLoader })],
  },
   {
    resource: RolePermission,
    options: { name: 'Users', navigation: 'Users & Auth' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: VocabularySet,
    options: { name: 'Vocabulary Sets', navigation: 'Vocabulary' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: VocabularyItem,
    options: { name: 'Vocabulary Items', navigation: 'Vocabulary', properties: { word: { isTitle: true } } },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: UnitVocabularySet,
    options: { name: 'Unit Vocabulary', navigation: 'Vocabulary' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: LessonVocabularySet,
    options: { name: 'Lesson Vocabulary', navigation: 'Vocabulary' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: StudentVocabularyProgress,
    options: { name: 'Student Vocabulary Progress', navigation: 'Vocabulary' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: GroupHomework,
    options: { name: 'Group Homework', navigation: 'Homework' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: HomeworkSubmission,
    options: { name: 'Homework Submissions', navigation: 'Homework' },
    features: [importExportFeature({ componentLoader })],
  },
   {
    resource: Book,
    options: { name: 'Book', navigation: 'Materials' },
    features: [importExportFeature({ componentLoader })],
  },
   {
    resource: StudentBook,
    options: { name: 'Student Books', navigation: 'Materials' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: StudentBookUnit,
    options: { name: 'Book Units', navigation: 'Materials' },
    features: [importExportFeature({ componentLoader })],
  },
    {
    resource: Video,
    options: { name: 'Videos', navigation: 'Digital Assets' },
    features: [importExportFeature({ componentLoader })],
  },
   {
    resource: Movie,
    options: { name: 'Movies', navigation: 'Digital Assets' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: Notifications,
    options: { name: 'Notifications', navigation: 'System' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: StudentPayment,
    options: { name: 'Payments', navigation: 'System' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: LessonProgress,
    options: { name: 'Lesson Progress', navigation: 'Progress Tracking' },
    features: [importExportFeature({ componentLoader })],
  },
  {
    resource: chatHistory,
    options: { name: 'Chat', navigation: 'Messaging' },
    features: [importExportFeature({ componentLoader })],
  },
  
],
  databases: [],
};

export default options;
