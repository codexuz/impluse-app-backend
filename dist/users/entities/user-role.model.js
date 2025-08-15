var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity.js';
import { Role } from './role.model.js';
let UserRole = class UserRole extends Model {
};
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], UserRole.prototype, "userId", void 0);
__decorate([
    ForeignKey(() => Role),
    Column({
        type: DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], UserRole.prototype, "roleId", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], UserRole.prototype, "assignedAt", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], UserRole.prototype, "expiresAt", void 0);
UserRole = __decorate([
    Table({
        tableName: 'user_roles',
        timestamps: true
    })
], UserRole);
export { UserRole };
//# sourceMappingURL=user-role.model.js.map