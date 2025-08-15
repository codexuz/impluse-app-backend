import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(createBookDto: CreateBookDto): Promise<import("./entities/book.entity.js").Book>;
    findAll(): Promise<import("./entities/book.entity.js").Book[]>;
    findByLevel(level: string): Promise<import("./entities/book.entity.js").Book[]>;
    findOne(id: string): Promise<import("./entities/book.entity.js").Book>;
    update(id: string, updateBookDto: UpdateBookDto): Promise<import("./entities/book.entity.js").Book>;
    remove(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<import("./entities/book.entity.js").Book>;
}
