import { CreateGroupChatDto } from './dto/create-group-chat.dto.js';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { AddGroupMemberDto, UpdateMemberRoleDto } from './dto/group-member.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { GroupChat } from './entities/group-chat.entity.js';
import { Messages } from './entities/messages.js';
import { GroupChatMembers } from './entities/chat_group_members.js';
export declare class GroupChatService {
    private groupChatModel;
    private messagesModel;
    private groupChatMembersModel;
    constructor(groupChatModel: typeof GroupChat, messagesModel: typeof Messages, groupChatMembersModel: typeof GroupChatMembers);
    create(createGroupChatDto: CreateGroupChatDto, userId: string): Promise<GroupChat>;
    findAll(userId: string, pagination: PaginationDto): Promise<{
        data: GroupChat[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, userId: string): Promise<GroupChat>;
    update(id: string, updateGroupChatDto: UpdateGroupChatDto, userId: string): Promise<GroupChat>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    createMessage(createMessageDto: CreateMessageDto, userId: string): Promise<Messages>;
    getMessages(groupId: string, userId: string, pagination: PaginationDto): Promise<{
        data: Messages[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMessage(messageId: string, updateMessageDto: UpdateMessageDto, userId: string): Promise<Messages>;
    deleteMessage(messageId: string, userId: string): Promise<{
        message: string;
    }>;
    addMember(groupId: string, addMemberDto: AddGroupMemberDto, userId: string): Promise<GroupChatMembers>;
    getMembers(groupId: string, userId: string, pagination: PaginationDto): Promise<{
        data: GroupChatMembers[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateMemberRole(groupId: string, memberId: string, updateRoleDto: UpdateMemberRoleDto, userId: string): Promise<{
        message: string;
    }>;
    removeMember(groupId: string, memberId: string, userId: string): Promise<{
        message: string;
    }>;
}
