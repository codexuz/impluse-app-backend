var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, AllowNull, Default, } from "sequelize-typescript";
let Upload = class Upload extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], Upload.prototype, "id", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Upload.prototype, "filename", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Upload.prototype, "original_name", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.STRING(100),
    }),
    __metadata("design:type", String)
], Upload.prototype, "mime_type", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.BIGINT,
    }),
    __metadata("design:type", Number)
], Upload.prototype, "file_size", void 0);
__decorate([
    AllowNull(false),
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Upload.prototype, "file_path", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.UUID,
    }),
    __metadata("design:type", String)
], Upload.prototype, "uploaded_by", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.STRING(100),
    }),
    __metadata("design:type", String)
], Upload.prototype, "upload_type", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.TEXT,
    }),
    __metadata("design:type", String)
], Upload.prototype, "description", void 0);
__decorate([
    Default(DataType.NOW),
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], Upload.prototype, "uploaded_at", void 0);
__decorate([
    AllowNull(true),
    Column({
        type: DataType.DATE,
    }),
    __metadata("design:type", Date)
], Upload.prototype, "deleted_at", void 0);
Upload = __decorate([
    Table({
        tableName: "uploads",
        timestamps: false,
    })
], Upload);
export { Upload };
//# sourceMappingURL=upload.entity.js.map