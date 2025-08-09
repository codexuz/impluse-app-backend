import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';

export enum MovieGenre {
    ACTION = 'action',
    COMEDY = 'comedy',
    DRAMA = 'drama',
    HORROR = 'horror',
    SCIFI = 'sci-fi'
}

export enum MovieType {
    MOVIE = 'movie',
    CARTOON = 'cartoon',
    SERIES = 'series'
}

export enum MovieLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export class CreateMovieDto {
    @IsString()
    title: string;

    @IsEnum(MovieGenre)
    genre: MovieGenre;

    @IsEnum(MovieType)
    type: MovieType;

    @IsOptional()
    @IsUrl()
    thumbnail?: string;

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsEnum(MovieLevel)
    @IsOptional()
    level?: MovieLevel = MovieLevel.BEGINNER;
}
