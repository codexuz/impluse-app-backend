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
let GroupAssignedLesson = class GroupAssignedLesson extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "lesson_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "group_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "granted_by", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "group_assigned_unit_id", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GroupAssignedLesson.prototype, "start_from", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GroupAssignedLesson.prototype, "end_at", void 0);
__decorate([
    Column({
        type: DataType.ENUM('locked', 'unlocked')
    }),
    __metadata("design:type", String)
], GroupAssignedLesson.prototype, "status", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], GroupAssignedLesson.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], GroupAssignedLesson.prototype, "updatedAt", void 0);
GroupAssignedLesson = __decorate([
    Table({
        tableName: 'groupAssignedLesson',
        timestamps: true,
    })
], GroupAssignedLesson);
export { GroupAssignedLesson };
//# sourceMappingURL=group_assigned_lesson.entity.js.map