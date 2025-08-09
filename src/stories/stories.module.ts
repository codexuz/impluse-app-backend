import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoriesService } from './stories.service.js';
import { StoriesController } from './stories.controller.js';
import { Story } from './entities/story.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([Story])],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}
