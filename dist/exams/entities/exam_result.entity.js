var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, } from "sequelize-typescript";
import { Exam } from "./exam.entity.js";
let ExamResult = class ExamResult extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], ExamResult.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Exam),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ExamResult.prototype, "exam_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ExamResult.prototype, "student_id", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ExamResult.prototype, "score", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 100,
    }),
    __metadata("design:type", Number)
], ExamResult.prototype, "max_score", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(5, 2),
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ExamResult.prototype, "percentage", void 0);
__decorate([
    Column({
        type: DataType.ENUM("passed", "failed"),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ExamResult.prototype, "result", void 0);
__decorate([
    Column({
        type: DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ExamResult.prototype, "section_scores", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ExamResult.prototype, "feedback", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ExamResult.prototype, "is_completed", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], ExamResult.prototype, "created_at", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], ExamResult.prototype, "updated_at", void 0);
ExamResult = __decorate([
    Table({
        tableName: "exam_results",
        timestamps: true,
    })
], ExamResult);
export { ExamResult };
//# sourceMappingURL=exam_result.entity.js.map