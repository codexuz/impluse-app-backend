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
let StudentPayment = class StudentPayment extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], StudentPayment.prototype, "id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], StudentPayment.prototype, "student_id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], StudentPayment.prototype, "manager_id", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentPayment.prototype, "amount", void 0);
__decorate([
    Column({
        type: DataType.ENUM("pending", "completed", "failed"),
    }),
    __metadata("design:type", String)
], StudentPayment.prototype, "status", void 0);
__decorate([
    Column({
        type: DataType.ENUM("Naqd", "Karta", "Click", "Payme"),
    }),
    __metadata("design:type", String)
], StudentPayment.prototype, "payment_method", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], StudentPayment.prototype, "payment_date", void 0);
__decorate([
    Column({
        type: DataType.DATEONLY,
    }),
    __metadata("design:type", Date)
], StudentPayment.prototype, "next_payment_date", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], StudentPayment.prototype, "notes", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], StudentPayment.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], StudentPayment.prototype, "updatedAt", void 0);
StudentPayment = __decorate([
    Table({
        tableName: "student_payments",
        timestamps: true,
    })
], StudentPayment);
export { StudentPayment };
//# sourceMappingURL=student-payment.entity.js.map