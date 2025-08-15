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
import { IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
export var MemberRole;
(function (MemberRole) {
    MemberRole["ADMIN"] = "admin";
    MemberRole["MEMBER"] = "member";
})(MemberRole || (MemberRole = {}));
export class AddGroupMemberDto {
    constructor() {
        this.role = MemberRole.MEMBER;
    }
}
__decorate([
    ApiProperty({
        description: 'User ID to add to the group',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AddGroupMemberDto.prototype, "user_id", void 0);
__decorate([
    ApiProperty({
        description: 'Role of the member in the group',
        enum: MemberRole,
        example: MemberRole.MEMBER,
        default: MemberRole.MEMBER,
    }),
    IsEnum(MemberRole),
    IsOptional(),
    __metadata("design:type", String)
], AddGroupMemberDto.prototype, "role", void 0);
export class UpdateMemberRoleDto {
}
__decorate([
    ApiProperty({
        description: 'New role for the member',
        enum: MemberRole,
        example: MemberRole.ADMIN,
    }),
    IsEnum(MemberRole),
    IsNotEmpty(),
    __metadata("design:type", String)
], UpdateMemberRoleDto.prototype, "role", void 0);
//# sourceMappingURL=group-member.dto.js.map