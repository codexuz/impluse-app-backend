import { MoviesService } from './movies.service.js';
import { CreateMovieDto, MovieGenre, MovieType, MovieLevel } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    create(createMovieDto: CreateMovieDto): Promise<import("./entities/movie.entity.js").Movie>;
    findAll(genre?: MovieGenre, type?: MovieType, level?: MovieLevel): Promise<import("./entities/movie.entity.js").Movie[]>;
    search(searchTerm: string): Promise<import("./entities/movie.entity.js").Movie[]>;
    findOne(id: string): Promise<import("./entities/movie.entity.js").Movie>;
    update(id: string, updateMovieDto: UpdateMovieDto): Promise<import("./entities/movie.entity.js").Movie>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/movie.entity.js").Movie>;
    hardRemove(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<import("./entities/movie.entity.js").Movie>;
}
