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
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateRoleScenarioDto } from '../../role-scenarios/dto/create-role-scenario.dto.js';
import { CreatePronunciationExerciseDto } from '../../pronunciation-exercise/dto/create-pronunciation-exercise.dto.js';
import { CreateIeltspart1QuestionDto } from '../../ieltspart1-question/dto/create-ieltspart1-question.dto.js';
import { CreateIeltspart2QuestionDto } from '../../ieltspart2-question/dto/create-ieltspart2-question.dto.js';
import { CreateIeltspart3QuestionDto } from '../../ieltspart3-question/dto/create-ieltspart3-question.dto.js';
export class CreateSpeakingDto {
}
__decorate([
    ApiProperty(),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "lessonId", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "topic", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "content", void 0);
__decorate([
    ApiProperty({ type: [CreateRoleScenarioDto], required: false }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateRoleScenarioDto),
    __metadata("design:type", Array)
], CreateSpeakingDto.prototype, "roleScenarios", void 0);
__decorate([
    ApiProperty({ type: [CreatePronunciationExerciseDto], required: false }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreatePronunciationExerciseDto),
    __metadata("design:type", Array)
], CreateSpeakingDto.prototype, "pronunciationExercises", void 0);
__decorate([
    ApiProperty({ type: [CreateIeltspart1QuestionDto], required: false }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateIeltspart1QuestionDto),
    __metadata("design:type", Array)
], CreateSpeakingDto.prototype, "ieltspart1Questions", void 0);
__decorate([
    ApiProperty({ type: [CreateIeltspart2QuestionDto], required: false }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateIeltspart2QuestionDto),
    __metadata("design:type", Array)
], CreateSpeakingDto.prototype, "ieltspart2Questions", void 0);
__decorate([
    ApiProperty({ type: [CreateIeltspart3QuestionDto], required: false }),
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateIeltspart3QuestionDto),
    __metadata("design:type", Array)
], CreateSpeakingDto.prototype, "ieltspart3Questions", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "instruction", void 0);
__decorate([
    ApiProperty({ enum: ['A1', 'A2', 'B1', 'B2', 'C1'] }),
    IsEnum(['A1', 'A2', 'B1', 'B2', 'C1']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "level", void 0);
__decorate([
    ApiProperty({ enum: ['pronunciation', 'role-scenario', 'part_1', 'part_2', 'part_3'] }),
    IsEnum(['pronunciation', 'role-scenario', 'part_1', 'part_2', 'part_3']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSpeakingDto.prototype, "type", void 0);
//# sourceMappingURL=create-speaking.dto.js.map