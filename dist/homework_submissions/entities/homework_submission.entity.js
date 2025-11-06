var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, } from "sequelize-typescript";
let HomeworkSubmission = class HomeworkSubmission extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "homework_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "student_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "lesson_id", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "updatedAt", void 0);
HomeworkSubmission = __decorate([
    Table({
        tableName: "homework_submission",
        timestamps: true,
    })
], HomeworkSubmission);
export { HomeworkSubmission };
//# sourceMappingURL=homework_submission.entity.js.map