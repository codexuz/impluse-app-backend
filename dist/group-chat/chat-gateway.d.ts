import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GroupChatService } from './group-chat.service.js';
import { MessageType } from './dto/create-message.dto.js';
interface AuthenticatedSocket extends Socket {
    user?: {
        id: string;
        username: string;
        role: string;
        first_name?: string;
        last_name?: string;
    };
}
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private groupChatService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService, groupChatService: GroupChatService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleNewMessage(client: AuthenticatedSocket, messageData: {
        text: string;
        type?: 'message' | 'announcement';
    }): Promise<void>;
    handleTyping(client: AuthenticatedSocket, data: {
        isTyping: boolean;
    }): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): Promise<void>;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): Promise<void>;
    handleGetOnlineUsers(client: AuthenticatedSocket): void;
    handleJoinGroupChat(client: AuthenticatedSocket, data: {
        groupId: string;
    }): Promise<void>;
    handleLeaveGroupChat(client: AuthenticatedSocket, data: {
        groupId: string;
    }): Promise<void>;
    handleSendGroupMessage(client: AuthenticatedSocket, messageData: {
        groupId: string;
        content: string;
        message_type?: MessageType;
    }): Promise<void>;
    handleGroupTyping(client: AuthenticatedSocket, data: {
        groupId: string;
        isTyping: boolean;
    }): void;
    handleGetGroupMembers(client: AuthenticatedSocket, data: {
        groupId: string;
    }): Promise<void>;
    handleDeleteGroupMessage(client: AuthenticatedSocket, data: {
        messageId: string;
        groupId: string;
    }): Promise<void>;
    private getAllowedRooms;
    sendSystemAnnouncement(message: string, targetRole?: string): void;
    notifyGroupMemberAdded(groupId: string, newMember: any, addedBy: any): void;
    notifyGroupMemberRemoved(groupId: string, removedMember: any, removedBy: any): void;
    notifyGroupUpdated(groupId: string, updates: any, updatedBy: any): void;
    notifyGroupDeleted(groupId: string, deletedBy: any): void;
    sendNotificationToUser(userId: string, notification: any): void;
    getOnlineGroupMembers(groupId: string): string[];
}
export {};
