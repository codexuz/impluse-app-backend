var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity.js';
import { Group } from '../../groups/entities/group.entity.js';
let GroupStudent = class GroupStudent extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], GroupStudent.prototype, "id", void 0);
__decorate([
    ForeignKey(() => Group),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupStudent.prototype, "group_id", void 0);
__decorate([
    BelongsTo(() => Group),
    __metadata("design:type", Group)
], GroupStudent.prototype, "group", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupStudent.prototype, "student_id", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], GroupStudent.prototype, "student", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], GroupStudent.prototype, "enrolled_at", void 0);
__decorate([
    Column({
        type: DataType.ENUM('active', 'removed', 'completed', 'frozen'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupStudent.prototype, "status", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], GroupStudent.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], GroupStudent.prototype, "updatedAt", void 0);
GroupStudent = __decorate([
    Table({
        tableName: 'group_students',
        timestamps: true,
    })
], GroupStudent);
export { GroupStudent };
//# sourceMappingURL=group-student.entity.js.map