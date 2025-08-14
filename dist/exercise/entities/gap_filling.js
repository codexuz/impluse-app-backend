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
let GapFilling = class GapFilling extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], GapFilling.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], GapFilling.prototype, "question_id", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GapFilling.prototype, "gap_number", void 0);
__decorate([
    Column({
        type: DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], GapFilling.prototype, "correct_answer", void 0);
GapFilling = __decorate([
    Table({
        tableName: "gap_filling",
        timestamps: true,
    })
], GapFilling);
export { GapFilling };
//# sourceMappingURL=gap_filling.js.map