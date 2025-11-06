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
import { IsOptional, IsNumber, IsUUID, IsEnum } from "class-validator";
export class UpdateHomeworkSectionDto {
}
__decorate([
    ApiProperty({
        description: "UUID of the exercise",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: false,
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateHomeworkSectionDto.prototype, "exercise_id", void 0);
__decorate([
    ApiProperty({
        description: "UUID of the speaking exercise (for speaking sections)",
        example: "123e4567-e89b-12d3-a456-426614174000",
        required: false,
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateHomeworkSectionDto.prototype, "speaking_id", void 0);
__decorate([
    ApiProperty({
        description: "Score achieved in this section (as float)",
        example: 85.5,
        required: false,
        type: "number",
    }),
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateHomeworkSectionDto.prototype, "score", void 0);
__decorate([
    ApiProperty({
        description: "Section type of the homework",
        enum: ["reading", "listening", "grammar", "writing", "speaking"],
        example: "reading",
        required: false,
    }),
    IsEnum(["reading", "listening", "grammar", "writing", "speaking"]),
    IsOptional(),
    __metadata("design:type", String)
], UpdateHomeworkSectionDto.prototype, "section", void 0);
__decorate([
    ApiProperty({
        description: "Student answers for the homework section (JSON object)",
        example: { question1: "answer1", question2: "answer2" },
        required: false,
    }),
    IsOptional(),
    __metadata("design:type", Object)
], UpdateHomeworkSectionDto.prototype, "answers", void 0);
//# sourceMappingURL=update-homework-section.dto.js.map