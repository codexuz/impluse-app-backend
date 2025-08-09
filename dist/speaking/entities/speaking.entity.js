var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from "sequelize-typescript";
let Speaking = class Speaking extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Speaking.prototype, "id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], Speaking.prototype, "lessonId", void 0);
__decorate([
    Column(DataType.TEXT),
    __metadata("design:type", String)
], Speaking.prototype, "topic", void 0);
__decorate([
    Column(DataType.TEXT),
    __metadata("design:type", String)
], Speaking.prototype, "content", void 0);
__decorate([
    Column(DataType.TEXT),
    __metadata("design:type", String)
], Speaking.prototype, "instruction", void 0);
__decorate([
    Column({
        type: DataType.ENUM("A1", "A2", "B1", "B2", "C1"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Speaking.prototype, "level", void 0);
__decorate([
    Column({
        type: DataType.ENUM("pronunciation", "role-scenario", "part_1", "part_2", "part_3"),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Speaking.prototype, "type", void 0);
Speaking = __decorate([
    Table({
        tableName: "speaking",
        timestamps: true,
    })
], Speaking);
export { Speaking };
//# sourceMappingURL=speaking.entity.js.map