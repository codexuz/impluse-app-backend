import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export class AddGroupMemberDto {
  @ApiProperty({
    description: 'User ID to add to the group',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Role of the member in the group',
    enum: MemberRole,
    example: MemberRole.MEMBER,
    default: MemberRole.MEMBER,
  })
  @IsEnum(MemberRole)
  @IsOptional()
  role?: MemberRole = MemberRole.MEMBER;
}

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the member',
    enum: MemberRole,
    example: MemberRole.ADMIN,
  })
  @IsEnum(MemberRole)
  @IsNotEmpty()
  role: MemberRole;
}
