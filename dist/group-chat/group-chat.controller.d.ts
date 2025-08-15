import { GroupChatService } from './group-chat.service.js';
import { CreateGroupChatDto } from './dto/create-group-chat.dto.js';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { AddGroupMemberDto, UpdateMemberRoleDto } from './dto/group-member.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
export declare class GroupChatController {
    private readonly groupChatService;
    constructor(groupChatService: GroupChatService);
    create(createGroupChatDto: CreateGroupChatDto, req: any): Promise<import("./entities/group-chat.entity.js").GroupChat>;
    findAll(pagination: PaginationDto, req: any): Promise<{
        data: import("./entities/group-chat.entity.js").GroupChat[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, req: any): Promise<import("./entities/group-chat.entity.js").GroupChat>;
    update(id: string, updateGroupChatDto: UpdateGroupChatDto, req: any): Promise<import("./entities/group-chat.entity.js").GroupChat>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    createMessage(groupId: string, createMessageDto: CreateMessageDto, req: any): Promise<import("./entities/messages.js").Messages>;
    getMessages(groupId: string, pagination: PaginationDto, req: any): Promise<{
        data: import("./entities/messages.js").Messages[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMessage(messageId: string, updateMessageDto: UpdateMessageDto, req: any): Promise<import("./entities/messages.js").Messages>;
    deleteMessage(messageId: string, req: any): Promise<{
        message: string;
    }>;
    addMember(groupId: string, addMemberDto: AddGroupMemberDto, req: any): Promise<import("./entities/chat_group_members.js").GroupChatMembers>;
    getMembers(groupId: string, pagination: PaginationDto, req: any): Promise<{
        data: import("./entities/chat_group_members.js").GroupChatMembers[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMemberRole(groupId: string, memberId: string, updateRoleDto: UpdateMemberRoleDto, req: any): Promise<{
        message: string;
    }>;
    removeMember(groupId: string, memberId: string, req: any): Promise<{
        message: string;
    }>;
}
