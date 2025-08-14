var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, } from "sequelize-typescript";
import { Lesson } from "../../lesson/entities/lesson.entity.js";
let LessonProgress = class LessonProgress extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], LessonProgress.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LessonProgress.prototype, "student_id", void 0);
__decorate([
    ForeignKey(() => Lesson),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LessonProgress.prototype, "lesson_id", void 0);
__decorate([
    BelongsTo(() => Lesson),
    __metadata("design:type", Lesson)
], LessonProgress.prototype, "lesson", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "completed", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(5, 2),
        defaultValue: 0.00,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], LessonProgress.prototype, "progress_percentage", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "reading_completed", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "listening_completed", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "grammar_completed", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "writing_completed", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "speaking_completed", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], LessonProgress.prototype, "completed_sections_count", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        defaultValue: 5,
    }),
    __metadata("design:type", Number)
], LessonProgress.prototype, "total_sections_count", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], LessonProgress.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], LessonProgress.prototype, "updatedAt", void 0);
LessonProgress = __decorate([
    Table({
        tableName: "lesson_progress",
        timestamps: true,
    })
], LessonProgress);
export { LessonProgress };
//# sourceMappingURL=lesson_progress.entity.js.map