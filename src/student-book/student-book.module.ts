import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentBook } from './entities/student-book.entity.js';
import { User } from '../users/entities/user.entity.js';
import { StudentBookService } from './student-book.service.js';
import { StudentBookController } from './student-book.controller.js';

@Module({
  imports: [SequelizeModule.forFeature([StudentBook, User])],
  controllers: [StudentBookController],
  providers: [StudentBookService],
  exports: [StudentBookService],
})
export class StudentBookModule {}