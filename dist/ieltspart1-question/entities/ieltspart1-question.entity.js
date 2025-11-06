var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from "sequelize-typescript";
let Ieltspart1Question = class Ieltspart1Question extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "speaking_id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "question", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "image_url", void 0);
__decorate([
    Column({
        type: DataType.ENUM("part_1.1", "part_1.2"),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "audio_url", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Ieltspart1Question.prototype, "sample_answer", void 0);
Ieltspart1Question = __decorate([
    Table({
        tableName: "ielstpart1_question",
        timestamps: true,
    })
], Ieltspart1Question);
export { Ieltspart1Question };
//# sourceMappingURL=ieltspart1-question.entity.js.map