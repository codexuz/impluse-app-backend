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
let Unit = class Unit extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Unit.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Unit.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Unit.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Unit.prototype, "order", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Unit.prototype, "isActive", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Unit.prototype, "courseId", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Unit.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Unit.prototype, "updatedAt", void 0);
Unit = __decorate([
    Table({
        tableName: 'units',
        timestamps: true,
    })
], Unit);
export { Unit };
//# sourceMappingURL=units.entity.js.map