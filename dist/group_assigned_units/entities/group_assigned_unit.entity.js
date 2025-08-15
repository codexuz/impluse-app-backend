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
let GroupAssignedUnit = class GroupAssignedUnit extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], GroupAssignedUnit.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.ENUM('locked', 'unlocked')
    }),
    __metadata("design:type", String)
], GroupAssignedUnit.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedUnit.prototype, "group_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedUnit.prototype, "unit_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GroupAssignedUnit.prototype, "teacher_id", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], GroupAssignedUnit.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], GroupAssignedUnit.prototype, "updatedAt", void 0);
GroupAssignedUnit = __decorate([
    Table({
        tableName: "group_assigned_units",
        timestamps: true,
    })
], GroupAssignedUnit);
export { GroupAssignedUnit };
//# sourceMappingURL=group_assigned_unit.entity.js.map