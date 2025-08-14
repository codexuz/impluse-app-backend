var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
let Movie = class Movie extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], Movie.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false
    }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.ENUM('action', 'comedy', 'drama', 'horror', 'sci-fi'),
        allowNull: false
    }),
    __metadata("design:type", String)
], Movie.prototype, "genre", void 0);
__decorate([
    Column({
        type: DataType.ENUM('movie', 'cartoon', 'series'),
        allowNull: false
    }),
    __metadata("design:type", String)
], Movie.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], Movie.prototype, "thumbnail", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], Movie.prototype, "url", void 0);
__decorate([
    Column({
        type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
        allowNull: false,
        defaultValue: 'A1'
    }),
    __metadata("design:type", String)
], Movie.prototype, "level", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Movie.prototype, "views", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Movie.prototype, "created_at", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Movie.prototype, "updated_at", void 0);
__decorate([
    DeletedAt,
    __metadata("design:type", Date)
], Movie.prototype, "deleted_at", void 0);
Movie = __decorate([
    Table({
        tableName: 'movies',
        timestamps: true,
        paranoid: true
    })
], Movie);
export { Movie };
//# sourceMappingURL=movie.entity.js.map