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
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2'
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
    level?: MovieLevel = MovieLevel.A1;
}
