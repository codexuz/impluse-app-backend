import { Module } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BooksController } from './books.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './entities/book.entity.js'; 
@Module({
  imports: [
    SequelizeModule.forFeature([Book])
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, SequelizeModule]
})
export class BooksModule {}
