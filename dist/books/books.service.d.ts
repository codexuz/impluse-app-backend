import { Book } from './entities/book.entity.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
export declare class BooksService {
    private bookModel;
    constructor(bookModel: typeof Book);
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(): Promise<Book[]>;
    findOne(id: string): Promise<Book>;
    findByLevel(level: string): Promise<Book[]>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<Book>;
    remove(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<Book>;
}
