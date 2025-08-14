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
let Story = class Story extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Story.prototype, "id", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Story.prototype, "title", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Story.prototype, "url", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Story.prototype, "image_url", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Story.prototype, "isPublished", void 0);
__decorate([
    Column({
        type: DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Story.prototype, "viewCount", void 0);
__decorate([
    CreatedAt,
    __metadata("design:type", Date)
], Story.prototype, "createdAt", void 0);
__decorate([
    UpdatedAt,
    __metadata("design:type", Date)
], Story.prototype, "updatedAt", void 0);
Story = __decorate([
    Table({
        tableName: "stories",
        timestamps: true,
    })
], Story);
export { Story };
//# sourceMappingURL=story.entity.js.map