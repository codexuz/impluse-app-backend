var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, } from "sequelize-typescript";
let chatHistory = class chatHistory extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], chatHistory.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], chatHistory.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.ENUM('user', 'assistant'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], chatHistory.prototype, "role", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], chatHistory.prototype, "content", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], chatHistory.prototype, "created_at", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], chatHistory.prototype, "updated_at", void 0);
__decorate([
    DeletedAt,
    __metadata("design:type", Date)
], chatHistory.prototype, "deleted_at", void 0);
chatHistory = __decorate([
    Table({
        tableName: "chat_histories",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
], chatHistory);
export { chatHistory };
//# sourceMappingURL=ai-chat-bot.entity.js.map