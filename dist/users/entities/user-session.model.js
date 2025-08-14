var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, ForeignKey, } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity.js';
let UserSession = class UserSession extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    }),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], UserSession.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false
    }),
    __metadata("design:type", String)
], UserSession.prototype, "jwtToken", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], UserSession.prototype, "userAgent", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true
    }),
    __metadata("design:type", String)
], UserSession.prototype, "ipAddress", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false
    }),
    __metadata("design:type", Date)
], UserSession.prototype, "expiresAt", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    }),
    __metadata("design:type", Boolean)
], UserSession.prototype, "isActive", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], UserSession.prototype, "lastAccessedAt", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true
    }),
    __metadata("design:type", String)
], UserSession.prototype, "refreshToken", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true
    }),
    __metadata("design:type", Date)
], UserSession.prototype, "refreshTokenExpiresAt", void 0);
UserSession = __decorate([
    Table({
        tableName: 'user_sessions',
        timestamps: true
    })
], UserSession);
export { UserSession };
//# sourceMappingURL=user-session.model.js.map