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
let Questions = class Questions extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Questions.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Questions.prototype, "exercise_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM("multiple_choice", "fill_in_the_blank", "true_false", "short_answer", "matching", "sentence_build"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Questions.prototype, "question_type", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Questions.prototype, "question_text", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], Questions.prototype, "points", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Questions.prototype, "order_number", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Questions.prototype, "sample_answer", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Questions.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Questions.prototype, "updatedAt", void 0);
Questions = __decorate([
    Table({
        tableName: "questions",
        timestamps: true,
        paranoid: true,
    })
], Questions);
export { Questions };
//# sourceMappingURL=questions.js.map