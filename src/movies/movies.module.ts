import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { MoviesController } from './movies.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity.js'; 
@Module({
  imports: [
    SequelizeModule.forFeature([Movie]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService, SequelizeModule],
})
export class MoviesModule {}
