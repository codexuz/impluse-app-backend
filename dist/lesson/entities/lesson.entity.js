var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, } from 'sequelize-typescript';
let Lesson = class Lesson extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Lesson.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Lesson.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Lesson.prototype, "order", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Lesson.prototype, "isActive", void 0);
__decorate([
    Column({
        type: DataType.ENUM('lesson', 'practice', 'test'),
        defaultValue: 'lesson',
    }),
    __metadata("design:type", String)
], Lesson.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Lesson.prototype, "moduleId", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Lesson.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Lesson.prototype, "updatedAt", void 0);
Lesson = __decorate([
    Table({
        tableName: 'lessons',
        timestamps: true,
    })
], Lesson);
export { Lesson };
//# sourceMappingURL=lesson.entity.js.map