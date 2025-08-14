var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, } from "sequelize-typescript";
let Video = class Video extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Video.prototype, "url", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Video.prototype, "level", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "subtitle", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "thumbnail", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Video.prototype, "views", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Video.prototype, "source", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Video.prototype, "created_at", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Video.prototype, "updated_at", void 0);
__decorate([
    DeletedAt,
    __metadata("design:type", Date)
], Video.prototype, "deleted_at", void 0);
Video = __decorate([
    Table({
        tableName: "videos",
        timestamps: true,
        paranoid: true,
    })
], Video);
export { Video };
//# sourceMappingURL=video.entity.js.map