var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
export class CreateStudentBookUnitDto {
}
__decorate([
    ApiProperty({ description: 'Student book ID' }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentBookUnitDto.prototype, "student_book_id", void 0);
__decorate([
    ApiProperty({ description: 'Unit ID' }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentBookUnitDto.prototype, "unit_id", void 0);
__decorate([
    ApiProperty({ description: 'Unit title' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentBookUnitDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ description: 'Unit URL' }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentBookUnitDto.prototype, "url", void 0);
//# sourceMappingURL=create-student-book-unit.dto.js.map