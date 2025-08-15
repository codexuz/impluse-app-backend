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
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateVideoDto {
}
__decorate([
    ApiProperty({ description: 'Video URL' }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "url", void 0);
__decorate([
    ApiProperty({ description: 'Video source', required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "source", void 0);
__decorate([
    ApiProperty({ description: 'Video source', required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateVideoDto.prototype, "level", void 0);
//# sourceMappingURL=create-video.dto.js.map