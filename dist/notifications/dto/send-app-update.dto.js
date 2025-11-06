var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
export class SendAppUpdateDto {
}
__decorate([
    ApiPropertyOptional({
        description: 'Custom message for the update notification',
        example: 'New version 2.0 is available with exciting features!'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], SendAppUpdateDto.prototype, "customMessage", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Custom Play Store URL',
        example: 'https://play.google.com/store/apps/details?id=edu.impulse.uz'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], SendAppUpdateDto.prototype, "playStoreUrl", void 0);
//# sourceMappingURL=send-app-update.dto.js.map