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
import { Role } from './role.model.js';
import { Permission } from './permission.model.js';
let RolePermission = class RolePermission extends Model {
};
__decorate([
    ForeignKey(() => Role),
    Column({
        type: DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], RolePermission.prototype, "roleId", void 0);
__decorate([
    ForeignKey(() => Permission),
    Column({
        type: DataType.INTEGER,
        allowNull: false
    }),
    __metadata("design:type", Number)
], RolePermission.prototype, "permissionId", void 0);
RolePermission = __decorate([
    Table({
        tableName: 'role_permissions',
        timestamps: true
    })
], RolePermission);
export { RolePermission };
//# sourceMappingURL=role-permission.model.js.map