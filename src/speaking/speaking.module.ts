import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Speaking } from './entities/speaking.entity.js';
import { SpeakingService } from './speaking.service.js';
import { SpeakingController } from './speaking.controller.js';
import { RoleScenario } from '../role-scenarios/entities/role-scenario.entity.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Speaking,
      RoleScenario,
      PronunciationExercise,
      Ieltspart1Question,
      Ieltspart2Question,
      Ieltspart3Question
    ])
  ],
  controllers: [SpeakingController],
  providers: [SpeakingService],
  exports: [SpeakingService],
})
export class SpeakingModule {}