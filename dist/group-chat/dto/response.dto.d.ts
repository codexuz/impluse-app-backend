export declare class GroupChatResponseDto {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    link?: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MessageResponseDto {
    id: string;
    chat_group_id: string;
    sender_id: string;
    content: string;
    message_type: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GroupMemberResponseDto {
    id: string;
    chat_group_id: string;
    user_id: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class SuccessResponseDto {
    message: string;
}
