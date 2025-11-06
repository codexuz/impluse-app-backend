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
let SupportSchedule = class SupportSchedule extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], SupportSchedule.prototype, "id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], SupportSchedule.prototype, "support_teacher_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
    }),
    __metadata("design:type", String)
], SupportSchedule.prototype, "group_id", void 0);
__decorate([
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], SupportSchedule.prototype, "schedule_date", void 0);
__decorate([
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], SupportSchedule.prototype, "start_time", void 0);
__decorate([
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], SupportSchedule.prototype, "end_time", void 0);
__decorate([
    Column(DataType.TEXT),
    __metadata("design:type", String)
], SupportSchedule.prototype, "topic", void 0);
__decorate([
    Column(DataType.TEXT),
    __metadata("design:type", String)
], SupportSchedule.prototype, "notes", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], SupportSchedule.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], SupportSchedule.prototype, "updatedAt", void 0);
SupportSchedule = __decorate([
    Table({
        tableName: "support_schedules",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
], SupportSchedule);
export { SupportSchedule };
//# sourceMappingURL=support-schedule.entity.js.map