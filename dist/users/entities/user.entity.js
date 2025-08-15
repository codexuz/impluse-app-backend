var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, AllowNull, Unique, Default, } from 'sequelize-typescript';
let User = class User extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], User.prototype, "user_id", void 0);
__decorate([
    AllowNull(false),
    Unique,
    Column({
        type: DataType.STRING(50),
        validate: {
            notEmpty: true,
        },
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    AllowNull(false),
    Column(DataType.STRING(555)),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    AllowNull(true),
    Column(DataType.UUID),
    __metadata("design:type", String)
], User.prototype, "level_id", void 0);
__decorate([
    AllowNull(true),
    Unique,
    Column(DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    AllowNull(false),
    Column(DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    AllowNull(false),
    Column(DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    AllowNull(true),
    Column(DataType.STRING(500)),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    Default(true),
    Column(DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    Default(DataType.NOW),
    Column(DataType.DATE),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    AllowNull(true),
    Column(DataType.DATE),
    __metadata("design:type", Date)
], User.prototype, "last_login", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], User.prototype, "currentSessionId", void 0);
User = __decorate([
    Table({
        tableName: 'users',
        timestamps: false,
    })
], User);
export { User };
//# sourceMappingURL=user.entity.js.map