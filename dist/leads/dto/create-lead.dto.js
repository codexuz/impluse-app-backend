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
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
export var LeadStatus;
(function (LeadStatus) {
    LeadStatus["YANGI"] = "Yangi";
    LeadStatus["ALOQADA"] = "Aloqada";
    LeadStatus["SINOVDA"] = "Sinovda";
    LeadStatus["SINOVDA_QATNASHDI"] = "Sinovda qatnashdi";
    LeadStatus["SINOVDAN_KETDI"] = "Sinovdan ketdi";
    LeadStatus["OQISHGA_YOZILDI"] = "O'qishga yozildi";
    LeadStatus["YOQOTILDI"] = "Yo'qotildi";
})(LeadStatus || (LeadStatus = {}));
export var LeadSource;
(function (LeadSource) {
    LeadSource["INSTAGRAM"] = "Instagram";
    LeadSource["TELEGRAM"] = "Telegram";
    LeadSource["DOSTIMDAN"] = "Do'stimdan";
    LeadSource["OZIM_KELDIM"] = "O'zim keldim";
    LeadSource["FLAYER"] = "Flayer";
    LeadSource["BANNER_YONDAGI"] = "Banner(yondagi)";
    LeadSource["BANNER_KOCHADAGI"] = "Banner(ko'chadagi)";
    LeadSource["BOSHQA"] = "Boshqa";
})(LeadSource || (LeadSource = {}));
export class CreateLeadDto {
}
__decorate([
    ApiProperty({
        description: 'Lead phone number',
        example: '+998901234567'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({
        description: 'Lead question or inquiry',
        example: 'Ingliz tili kurslari haqida malumot olmoqchiman'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "question", void 0);
__decorate([
    ApiProperty({
        description: 'Lead first name',
        example: 'John'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "first_name", void 0);
__decorate([
    ApiProperty({
        description: 'Lead last name',
        example: 'Doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "last_name", void 0);
__decorate([
    ApiProperty({
        description: 'Lead status',
        enum: LeadStatus,
        example: LeadStatus.YANGI
    }),
    IsEnum(LeadStatus),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Lead source',
        enum: LeadSource,
        example: LeadSource.INSTAGRAM
    }),
    IsEnum(LeadSource),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "source", void 0);
__decorate([
    ApiProperty({
        description: 'Course ID the lead is interested in',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "course_id", void 0);
__decorate([
    ApiProperty({
        description: 'Admin ID who created the lead',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "admin_id", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes about the lead',
        example: 'Called at 2pm, interested in evening classes'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadDto.prototype, "notes", void 0);
//# sourceMappingURL=create-lead.dto.js.map