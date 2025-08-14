export declare enum MovieGenre {
    ACTION = "action",
    COMEDY = "comedy",
    DRAMA = "drama",
    HORROR = "horror",
    SCIFI = "sci-fi"
}
export declare enum MovieType {
    MOVIE = "movie",
    CARTOON = "cartoon",
    SERIES = "series"
}
export declare enum MovieLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class CreateMovieDto {
    title: string;
    genre: MovieGenre;
    type: MovieType;
    thumbnail?: string;
    url?: string;
    level?: MovieLevel;
}
