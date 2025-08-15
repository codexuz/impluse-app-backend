var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, } from "sequelize-typescript";
let Attendance = class Attendance extends Model {
};
__decorate([
    PrimaryKey,
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "group_id", void 0);
__decorate([
    Column({ type: DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Attendance.prototype, "student_id", void 0);
__decorate([
    Column({ type: DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], Attendance.prototype, "teacher_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM("present", "absent", "late"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    Column({ type: DataType.STRING, allowNull: false }),
    __metadata("design:type", String)
], Attendance.prototype, "note", void 0);
__decorate([
    Column({ type: DataType.DATEONLY, allowNull: false }),
    __metadata("design:type", String)
], Attendance.prototype, "date", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Attendance.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Attendance.prototype, "updatedAt", void 0);
Attendance = __decorate([
    Table({ tableName: "attendance" })
], Attendance);
export { Attendance };
//# sourceMappingURL=attendance.entity.js.map