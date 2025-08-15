var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, DataType, Model, CreatedAt, UpdatedAt, } from "sequelize-typescript";
let Messages = class Messages extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Messages.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Messages.prototype, "chat_group_id", void 0);
__decorate([
    Column({
        type: DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Messages.prototype, "sender_id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Messages.prototype, "content", void 0);
__decorate([
    Column({
        type: DataType.ENUM("text", "image", "file", "video", "audio"),
        allowNull: true,
    }),
    __metadata("design:type", String)
], Messages.prototype, "message_type", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Messages.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Messages.prototype, "updatedAt", void 0);
Messages = __decorate([
    Table({
        tableName: "messages",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
], Messages);
export { Messages };
//# sourceMappingURL=messages.js.map