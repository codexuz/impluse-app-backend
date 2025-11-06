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
let CdIelts = class CdIelts extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], CdIelts.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdIelts.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.ENUM('active', 'full', 'inactive'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdIelts.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], CdIelts.prototype, "exam_date", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdIelts.prototype, "time", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CdIelts.prototype, "location", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CdIelts.prototype, "seats", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CdIelts.prototype, "price", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], CdIelts.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], CdIelts.prototype, "updatedAt", void 0);
CdIelts = __decorate([
    Table({
        tableName: 'cd_ielts',
        timestamps: true,
    })
], CdIelts);
export { CdIelts };
//# sourceMappingURL=cd-ielt.entity.js.map