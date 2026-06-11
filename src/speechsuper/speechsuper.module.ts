import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SpeechSuperController } from "./speechsuper.controller.js";
import { SpeechSuperService } from "./speechsuper.service.js";
import { SpeechSuperApiService } from "./speechsuper-api.service.js";
import { SpeechSuperTopic } from "./entities/speechsuper-topic.entity.js";
import { SpeechSuperQuestion } from "./entities/speechsuper-question.entity.js";
import { SpeechSuperAttempt } from "./entities/speechsuper-attempt.entity.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      SpeechSuperTopic,
      SpeechSuperQuestion,
      SpeechSuperAttempt,
    ]),
    StudentProfileModule,
  ],
  controllers: [SpeechSuperController],
  providers: [SpeechSuperService, SpeechSuperApiService],
  exports: [SpeechSuperService, SpeechSuperApiService],
})
export class SpeechSuperModule {}
