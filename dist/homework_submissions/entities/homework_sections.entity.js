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
let HomeworkSection = class HomeworkSection extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], HomeworkSection.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], HomeworkSection.prototype, "submission_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], HomeworkSection.prototype, "exercise_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], HomeworkSection.prototype, "speaking_id", void 0);
__decorate([
    Column({
        type: DataType.FLOAT,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], HomeworkSection.prototype, "score", void 0);
__decorate([
    Column({
        type: DataType.ENUM("reading", "listening", "grammar", "writing", "speaking"),
        allowNull: true,
    }),
    __metadata("design:type", String)
], HomeworkSection.prototype, "section", void 0);
__decorate([
    Column({
        type: DataType.JSON,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], HomeworkSection.prototype, "answers", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], HomeworkSection.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], HomeworkSection.prototype, "updatedAt", void 0);
HomeworkSection = __decorate([
    Table({
        tableName: "homework_sections",
        timestamps: true,
    })
], HomeworkSection);
export { HomeworkSection };
//# sourceMappingURL=homework_sections.entity.js.map