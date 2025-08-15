var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';
let UserCourse = class UserCourse extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], UserCourse.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], UserCourse.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], UserCourse.prototype, "courseId", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    }),
    __metadata("design:type", Date)
], UserCourse.prototype, "enrolledAt", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], UserCourse.prototype, "isCompleted", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], UserCourse.prototype, "completedAt", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], UserCourse.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], UserCourse.prototype, "updatedAt", void 0);
UserCourse = __decorate([
    Table({
        tableName: 'user_courses',
        timestamps: true,
    })
], UserCourse);
export { UserCourse };
//# sourceMappingURL=user-course.entity.js.map