var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty } from "class-validator";
export class TransferStudentDto {
}
__decorate([
    ApiProperty({
        description: "The UUID of the student to transfer",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: "The UUID of the source group (where student is currently enrolled)",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "from_group_id", void 0);
__decorate([
    ApiProperty({
        description: "The UUID of the target group (where student will be transferred)",
        example: "987fcdeb-51a2-43d1-9b23-456789012345",
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TransferStudentDto.prototype, "to_group_id", void 0);
//# sourceMappingURL=transfer-student.dto.js.map