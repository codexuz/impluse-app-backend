import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './entities/book.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookModel: typeof Book,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return this.bookModel.create({ ...createBookDto, views: 0 });
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.findAll();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    
    // Increment view count and return updated book
    return this.incrementViewCount(id);
  }

  async findByLevel(level: string): Promise<Book[]> {
    return this.bookModel.findAll({
      where: { level },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    await book.update(updateBookDto);
    return book;
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }

  async incrementViewCount(id: string): Promise<Book> {
    const book = await this.bookModel.findByPk(id);
    
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    
    await book.increment('views');
    
    return book.reload();
  }
}
