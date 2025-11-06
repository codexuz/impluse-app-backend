var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, BelongsTo, ForeignKey, } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { Lead } from "../../leads/entities/lead.entity.js";
let LeadTrialLesson = class LeadTrialLesson extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], LeadTrialLesson.prototype, "id", void 0);
__decorate([
    Column(DataType.DATE),
    __metadata("design:type", Date)
], LeadTrialLesson.prototype, "scheduledAt", void 0);
__decorate([
    Column({
        type: DataType.ENUM("belgilangan", "keldi", "kelmadi"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], LeadTrialLesson.prototype, "status", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LeadTrialLesson.prototype, "teacher_id", void 0);
__decorate([
    BelongsTo(() => User, {
        foreignKey: "teacher_id",
        targetKey: "user_id",
        as: "teacherInfo",
    }),
    __metadata("design:type", User)
], LeadTrialLesson.prototype, "teacherInfo", void 0);
__decorate([
    ForeignKey(() => Lead),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LeadTrialLesson.prototype, "lead_id", void 0);
__decorate([
    BelongsTo(() => Lead, {
        foreignKey: "lead_id",
        targetKey: "id",
        as: "leadInfo",
    }),
    __metadata("design:type", Lead)
], LeadTrialLesson.prototype, "leadInfo", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LeadTrialLesson.prototype, "notes", void 0);
LeadTrialLesson = __decorate([
    Table({
        tableName: "lead_trial_lessons",
        timestamps: true,
        paranoid: true,
    })
], LeadTrialLesson);
export { LeadTrialLesson };
//# sourceMappingURL=lead-trial-lesson.entity.js.map