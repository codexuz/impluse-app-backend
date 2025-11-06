import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { Movie } from './entities/movie.entity.js';
export declare class MoviesService {
    private movieModel;
    constructor(movieModel: typeof Movie);
    create(createMovieDto: CreateMovieDto): Promise<Movie>;
    findAll(query?: {
        genre?: string;
        type?: string;
        level?: string;
    }): Promise<Movie[]>;
    search(searchTerm: string): Promise<Movie[]>;
    findOne(id: string): Promise<Movie>;
    update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Movie>;
    hardRemove(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<Movie>;
}
