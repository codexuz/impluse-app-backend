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
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
export class CreateFormDto {
}
__decorate([
    ApiProperty({
        description: 'The title of the form',
        example: 'Student Feedback Form'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateFormDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'The Vueform schema JSON',
        example: {
            fields: {
                name: { type: 'text', label: 'Full Name' },
                email: { type: 'email', label: 'Email Address' },
                feedback: { type: 'textarea', label: 'Your Feedback' }
            }
        }
    }),
    IsNotEmpty(),
    IsObject(),
    __metadata("design:type", Object)
], CreateFormDto.prototype, "schema", void 0);
//# sourceMappingURL=create-form.dto.js.map