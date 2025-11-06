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
let CdRegister = class CdRegister extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], CdRegister.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdRegister.prototype, "student_id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdRegister.prototype, "cd_test_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM('paid', 'pending', 'cancelled'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdRegister.prototype, "status", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], CdRegister.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], CdRegister.prototype, "updatedAt", void 0);
CdRegister = __decorate([
    Table({
        tableName: 'cd_register',
        timestamps: true,
    })
], CdRegister);
export { CdRegister };
//# sourceMappingURL=cd-register.entity.js.map