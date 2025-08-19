export declare enum MemberRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class AddGroupMemberDto {
    user_id: string;
    role?: MemberRole;
}
export declare class UpdateMemberRoleDto {
    role: MemberRole;
}
