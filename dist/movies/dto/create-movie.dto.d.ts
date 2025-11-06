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
    A1 = "A1",
    A2 = "A2",
    B1 = "B1",
    B2 = "B2",
    C1 = "C1",
    C2 = "C2"
}
export declare class CreateMovieDto {
    title: string;
    genre: MovieGenre;
    type: MovieType;
    thumbnail?: string;
    url?: string;
    level?: MovieLevel;
}
