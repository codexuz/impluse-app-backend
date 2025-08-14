var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import provider from './admin/auth-provider.js';
import options from './admin/options.js';
import AdminJS from 'adminjs';
import * as AdminJSSequelize from '@adminjs/sequelize';
import { CoursesModule } from './courses/courses.module.js';
import { ModuleModule } from './units/module.module.js';
import { UserCourseModule } from './user-course/user-course.module.js';
import { LessonModule } from './lesson/lesson.module.js';
import { ExerciseModule } from './exercise/exercise.module.js';
import { Models, initializeAssociations } from './models/index.js';
import { LessonContentModule } from './lesson-content/lesson-content.module.js';
import { GroupsModule } from './groups/groups.module.js';
import { GroupAssignedLessonsModule } from './group_assigned_lessons/group_assigned_lessons.module.js';
import { VocabularySetsModule } from './vocabulary_sets/vocabulary_sets.module.js';
import { VocabularyItemsModule } from './vocabulary_items/vocabulary_items.module.js';
import { UnitVocabularySetModule } from './unit_vocabulary_sets/unit-vocabulary-set.module.js';
import { LessonVocabularySetModule } from './lesson_vocabulary_sets/lesson_vocabulary_set.module.js';
import { StudentVocabularyProgressModule } from './student_vocabulary_progress/student-vocabulary-progress.module.js';
import { GroupHomeworksModule } from './group_homeworks/group_homeworks.module.js';
import { HomeworkSubmissionsModule } from './homework_submissions/homework_submissions.module.js';
import { GroupAssignedUnitsModule } from './group_assigned_units/group_assigned_units.module.js';
import { StudentProfileModule } from './student_profiles/student-profile.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { LessonProgressModule } from './lesson_progress/lesson_progress.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { GroupStudentsModule } from './group-students/group-students.module.js';
import { RoleScenariosModule } from './role-scenarios/role-scenarios.module.js';
import { SpeakingModule } from './speaking/speaking.module.js';
import { WritingModule } from './writing/writing.module.js';
import { PronunciationExerciseModule } from './pronunciation-exercise/pronunciation-exercise.module.js';
import { Ieltspart1QuestionModule } from './ieltspart1-question/ieltspart1-question.module.js';
import { Ieltspart2QuestionModule } from './ieltspart2-question/ieltspart2-question.module.js';
import { Ieltspart3QuestionModule } from './ieltspart3-question/ieltspart3-question.module.js';
import { BooksModule } from './books/books.module.js';
import { StudentBookModule } from './student-book/student-book.module.js';
import { StudentBookUnitsModule } from './student-book-units/student-book-units.module.js';
import { OpenaiService } from './services/openai/openai.service.js';
import { DeepgramService } from './services/deepgram/deepgram.service.js';
import { DeepseekService } from './services/deepseek/deepseek.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserNotificationsModule } from './user-notifications/user-notifications.module.js';
import { YoutubeCaptionsService } from './services/youtube-captions/youtube-captions.service.js';
import { DatabaseModule } from './database/database.module.js';
import { MoviesModule } from './movies/movies.module.js';
import { ExamModule } from './exams/exam.module.js';
import { StudentPaymentModule } from './student-payment/student-payment.module.js';
import { VideosModule } from './videos/videos.module.js';
import { AiChatBotModule } from './ai-chat-bot/ai-chat-bot.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { LeadTrialLessonsModule } from './lead-trial-lessons/lead-trial-lessons.module.js';
import { HttpModule } from '@nestjs/axios';
import { UploadModule } from './upload/upload.module.js';
import { SupportSchedulesModule } from './support-schedules/support-schedules.module.js';
import { SupportBookingsModule } from './support-bookings/support-bookings.module.js';
import { GroupChatModule } from './group-chat/group-chat.module.js';
import { OnesignalModule } from './onesignal/onesignal.module.js';
import { StoriesModule } from './stories/stories.module.js';
import { SpeechifyModule } from './services/speechify/speechify.module.js';
import { OpenaiModule } from './services/openai/openai.module.js';
import { VoiceChatBotModule } from './services/voice-chat-bot/voice-chat-bot.module.js';
AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});
let AppModule = class AppModule {
    async onModuleInit() {
        initializeAssociations();
    }
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            ScheduleModule.forRoot(),
            SequelizeModule.forRoot({
                dialect: 'mysql',
                host: '89.39.94.77',
                port: 3030,
                username: 'impulse_app',
                password: 'impulse_app',
                database: 'impulse_app',
                sync: { alter: true },
                models: [...Models],
                autoLoadModels: true,
                logging: true,
            }),
            AdminModule.createAdminAsync({
                useFactory: async () => {
                    return {
                        adminJsOptions: options,
                        auth: {
                            provider,
                            cookiePassword: 'adminjs',
                            cookieName: 'adminjs',
                        },
                        sessionOptions: {
                            resave: true,
                            saveUninitialized: true,
                            secret: 'adminjs',
                        },
                    };
                },
            }),
            HttpModule,
            UsersModule,
            CoursesModule,
            ModuleModule,
            UserCourseModule,
            LessonModule,
            ExerciseModule,
            LessonContentModule,
            PronunciationExerciseModule,
            GroupsModule,
            GroupAssignedLessonsModule,
            VocabularySetsModule,
            VocabularyItemsModule,
            UnitVocabularySetModule,
            LessonVocabularySetModule,
            StudentVocabularyProgressModule,
            GroupHomeworksModule,
            HomeworkSubmissionsModule,
            GroupAssignedUnitsModule,
            StudentProfileModule,
            NotificationsModule,
            LessonProgressModule,
            AttendanceModule,
            GroupStudentsModule,
            RoleScenariosModule,
            SpeakingModule,
            WritingModule,
            Ieltspart1QuestionModule,
            Ieltspart2QuestionModule,
            Ieltspart3QuestionModule,
            BooksModule,
            StudentBookModule,
            StudentBookUnitsModule,
            AuthModule,
            UserNotificationsModule,
            DatabaseModule,
            MoviesModule,
            ExamModule,
            StudentPaymentModule,
            VideosModule,
            AiChatBotModule,
            LeadsModule,
            LeadTrialLessonsModule,
            UploadModule,
            SupportSchedulesModule,
            SupportBookingsModule,
            GroupChatModule,
            OnesignalModule,
            StoriesModule,
            SpeechifyModule,
            OpenaiModule,
            VoiceChatBotModule,
        ],
        controllers: [AppController],
        providers: [AppService, OpenaiService, DeepgramService, DeepseekService, YoutubeCaptionsService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map