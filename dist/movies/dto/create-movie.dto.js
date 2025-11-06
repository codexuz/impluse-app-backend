var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
export var MovieGenre;
(function (MovieGenre) {
    MovieGenre["ACTION"] = "action";
    MovieGenre["COMEDY"] = "comedy";
    MovieGenre["DRAMA"] = "drama";
    MovieGenre["HORROR"] = "horror";
    MovieGenre["SCIFI"] = "sci-fi";
})(MovieGenre || (MovieGenre = {}));
export var MovieType;
(function (MovieType) {
    MovieType["MOVIE"] = "movie";
    MovieType["CARTOON"] = "cartoon";
    MovieType["SERIES"] = "series";
})(MovieType || (MovieType = {}));
export var MovieLevel;
(function (MovieLevel) {
    MovieLevel["A1"] = "A1";
    MovieLevel["A2"] = "A2";
    MovieLevel["B1"] = "B1";
    MovieLevel["B2"] = "B2";
    MovieLevel["C1"] = "C1";
    MovieLevel["C2"] = "C2";
})(MovieLevel || (MovieLevel = {}));
export class CreateMovieDto {
    constructor() {
        this.level = MovieLevel.A1;
    }
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "title", void 0);
__decorate([
    IsEnum(MovieGenre),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "genre", void 0);
__decorate([
    IsEnum(MovieType),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "type", void 0);
__decorate([
    IsOptional(),
    IsUrl(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "thumbnail", void 0);
__decorate([
    IsOptional(),
    IsUrl(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "url", void 0);
__decorate([
    IsEnum(MovieLevel),
    IsOptional(),
    __metadata("design:type", String)
], CreateMovieDto.prototype, "level", void 0);
//# sourceMappingURL=create-movie.dto.js.map