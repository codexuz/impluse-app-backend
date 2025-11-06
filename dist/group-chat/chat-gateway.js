var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GroupChatService } from './group-chat.service.js';
import { MessageType } from './dto/create-message.dto.js';
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(jwtService, groupChatService) {
        this.jwtService = jwtService;
        this.groupChatService = groupChatService;
        this.logger = new Logger(ChatGateway_1.name);
        this.connectedUsers = new Map();
    }
    afterInit(server) {
        this.logger.log('Chat Gateway initialized on port 3000 with namespace /chat');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn(`Client ${client.id} attempted to connect without token`);
                client.emit('error', { message: 'Authentication required' });
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            client.user = {
                id: payload.sub || payload.user_id,
                username: payload.username,
                role: payload.role,
                first_name: payload.first_name,
                last_name: payload.last_name,
            };
            const chatUser = {
                id: client.user.id,
                socketId: client.id,
                username: client.user.username,
                role: client.user.role,
                first_name: client.user.first_name,
                last_name: client.user.last_name,
                joinedAt: new Date(),
                isOnline: true,
            };
            this.connectedUsers.set(client.id, chatUser);
            await client.join(`role:${client.user.role}`);
            await client.join(`user:${client.user.id}`);
            this.logger.log(`User ${client.user.username} (${client.user.role}) connected: ${client.id}`);
            client.broadcast.emit('user-joined', {
                message: `${client.user.first_name || client.user.username} joined the chat`,
                user: {
                    id: client.user.id,
                    username: client.user.username,
                    role: client.user.role,
                    first_name: client.user.first_name,
                    last_name: client.user.last_name,
                },
                timestamp: new Date().toISOString(),
            });
            client.emit('welcome', {
                message: `Welcome to the chat, ${client.user.first_name || client.user.username}!`,
                onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
                timestamp: new Date().toISOString(),
            });
            this.server.emit('users-update', {
                onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
            });
        }
        catch (error) {
            this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
            client.emit('error', { message: 'Invalid token' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            this.connectedUsers.delete(client.id);
            this.logger.log(`User ${user.username} disconnected: ${client.id}`);
            client.broadcast.emit('user-left', {
                message: `${user.first_name || user.username} left the chat`,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
                timestamp: new Date().toISOString(),
            });
            this.server.emit('member-offline-global', {
                user: {
                    id: user.id,
                    username: user.username,
                },
                timestamp: new Date().toISOString(),
            });
            this.server.emit('users-update', {
                onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
            });
        }
    }
    async handleNewMessage(client, messageData) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        const { text, type = 'message' } = messageData;
        if (!text || text.trim().length === 0) {
            client.emit('error', { message: 'Message cannot be empty' });
            return;
        }
        if (text.length > 500) {
            client.emit('error', { message: 'Message too long (max 500 characters)' });
            return;
        }
        if (type === 'announcement' && !['admin', 'teacher', 'support_teacher'].includes(client.user.role)) {
            client.emit('error', { message: 'Insufficient permissions for announcements' });
            return;
        }
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: text.trim(),
            username: client.user.username,
            userId: client.user.id,
            role: client.user.role,
            timestamp: new Date().toISOString(),
            clientId: client.id,
            type,
        };
        this.logger.log(`Message from ${client.user.username}: ${text}`);
        this.server.emit('message', {
            ...message,
            user: {
                id: client.user.id,
                username: client.user.username,
                role: client.user.role,
                first_name: client.user.first_name,
                last_name: client.user.last_name,
            },
        });
    }
    handleTyping(client, data) {
        if (!client.user)
            return;
        client.broadcast.emit('user-typing', {
            user: {
                id: client.user.id,
                username: client.user.username,
                first_name: client.user.first_name,
                last_name: client.user.last_name,
            },
            isTyping: data.isTyping,
            timestamp: new Date().toISOString(),
        });
    }
    async handleJoinRoom(client, data) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        const allowedRooms = this.getAllowedRooms(client.user.role);
        if (!allowedRooms.includes(data.roomId)) {
            client.emit('error', { message: 'Access denied to this room' });
            return;
        }
        await client.join(data.roomId);
        client.emit('room-joined', { roomId: data.roomId });
        this.logger.log(`User ${client.user.username} joined room: ${data.roomId}`);
    }
    async handleLeaveRoom(client, data) {
        if (!client.user)
            return;
        await client.leave(data.roomId);
        client.emit('room-left', { roomId: data.roomId });
        this.logger.log(`User ${client.user.username} left room: ${data.roomId}`);
    }
    handleGetOnlineUsers(client) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        client.emit('online-users', {
            users: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
        });
    }
    async handleJoinGroupChat(client, data) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        try {
            await this.groupChatService.findOne(data.groupId, client.user.id);
            await client.join(`group:${data.groupId}`);
            client.emit('group-joined', {
                groupId: data.groupId,
                message: 'Successfully joined group chat'
            });
            client.to(`group:${data.groupId}`).emit('member-online', {
                user: {
                    id: client.user.id,
                    username: client.user.username,
                    first_name: client.user.first_name,
                    last_name: client.user.last_name,
                },
                groupId: data.groupId,
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`User ${client.user.username} joined group chat: ${data.groupId}`);
        }
        catch (error) {
            client.emit('error', {
                message: 'Failed to join group chat: ' + error.message
            });
        }
    }
    async handleLeaveGroupChat(client, data) {
        if (!client.user)
            return;
        await client.leave(`group:${data.groupId}`);
        client.emit('group-left', {
            groupId: data.groupId,
            message: 'Left group chat'
        });
        client.to(`group:${data.groupId}`).emit('member-offline', {
            user: {
                id: client.user.id,
                username: client.user.username,
            },
            groupId: data.groupId,
            timestamp: new Date().toISOString(),
        });
        this.logger.log(`User ${client.user.username} left group chat: ${data.groupId}`);
    }
    async handleSendGroupMessage(client, messageData) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        const { groupId, content, message_type = MessageType.TEXT } = messageData;
        if (!content || content.trim().length === 0) {
            client.emit('error', { message: 'Message content cannot be empty' });
            return;
        }
        if (content.length > 1000) {
            client.emit('error', { message: 'Message too long (max 1000 characters)' });
            return;
        }
        try {
            const createMessageDto = {
                group_id: groupId,
                content: content.trim(),
                message_type,
            };
            const savedMessage = await this.groupChatService.createMessage(createMessageDto, client.user.id);
            const groupMessage = {
                id: savedMessage.id,
                content: savedMessage.content,
                message_type: savedMessage.message_type,
                sender_id: savedMessage.sender_id,
                chat_group_id: savedMessage.chat_group_id,
                username: client.user.username,
                role: client.user.role,
                timestamp: savedMessage.createdAt
                    ? (savedMessage.createdAt instanceof Date
                        ? savedMessage.createdAt.toISOString()
                        : savedMessage.createdAt)
                    : new Date().toISOString(),
                clientId: client.id,
            };
            this.server.to(`group:${groupId}`).emit('groupMessage', {
                ...groupMessage,
                user: {
                    id: client.user.id,
                    username: client.user.username,
                    role: client.user.role,
                    first_name: client.user.first_name,
                    last_name: client.user.last_name,
                },
            });
            this.logger.log(`Group message sent by ${client.user.username} to group ${groupId}`);
        }
        catch (error) {
            client.emit('error', {
                message: 'Failed to send message: ' + error.message
            });
        }
    }
    handleGroupTyping(client, data) {
        if (!client.user)
            return;
        client.to(`group:${data.groupId}`).emit('group-user-typing', {
            user: {
                id: client.user.id,
                username: client.user.username,
                first_name: client.user.first_name,
                last_name: client.user.last_name,
            },
            groupId: data.groupId,
            isTyping: data.isTyping,
            timestamp: new Date().toISOString(),
        });
    }
    async handleGetGroupMembers(client, data) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        try {
            const members = await this.groupChatService.getMembers(data.groupId, client.user.id, { page: 1, limit: 100 });
            const onlineMembers = Array.from(this.connectedUsers.values())
                .filter(u => u.isOnline)
                .map(u => u.id);
            const membersWithStatus = members.data.map(member => ({
                ...member,
                isOnline: onlineMembers.includes(member.user_id),
            }));
            client.emit('group-members', {
                groupId: data.groupId,
                members: membersWithStatus,
                total: members.total,
            });
        }
        catch (error) {
            client.emit('error', {
                message: 'Failed to get group members: ' + error.message
            });
        }
    }
    async handleDeleteGroupMessage(client, data) {
        if (!client.user) {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        try {
            await this.groupChatService.deleteMessage(data.messageId, client.user.id);
            this.server.to(`group:${data.groupId}`).emit('messageDeleted', {
                messageId: data.messageId,
                groupId: data.groupId,
                deletedBy: {
                    id: client.user.id,
                    username: client.user.username,
                },
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`Message ${data.messageId} deleted by ${client.user.username}`);
        }
        catch (error) {
            client.emit('error', {
                message: 'Failed to delete message: ' + error.message
            });
        }
    }
    getAllowedRooms(role) {
        const baseRooms = ['general', `role:${role}`];
        switch (role) {
            case 'admin':
                return [...baseRooms, 'admin-only', 'teachers', 'support'];
            case 'teacher':
                return [...baseRooms, 'teachers', 'support'];
            case 'support_teacher':
                return [...baseRooms, 'support', 'teachers'];
            case 'student':
                return [...baseRooms, 'students'];
            default:
                return baseRooms;
        }
    }
    sendSystemAnnouncement(message, targetRole) {
        const announcement = {
            id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text: message,
            username: 'System',
            userId: 'system',
            role: 'system',
            timestamp: new Date().toISOString(),
            clientId: 'system',
            type: 'system',
        };
        if (targetRole) {
            this.server.to(`role:${targetRole}`).emit('message', announcement);
        }
        else {
            this.server.emit('message', announcement);
        }
    }
    notifyGroupMemberAdded(groupId, newMember, addedBy) {
        this.server.to(`group:${groupId}`).emit('member-added', {
            groupId,
            newMember,
            addedBy,
            timestamp: new Date().toISOString(),
        });
    }
    notifyGroupMemberRemoved(groupId, removedMember, removedBy) {
        this.server.to(`group:${groupId}`).emit('member-removed', {
            groupId,
            removedMember,
            removedBy,
            timestamp: new Date().toISOString(),
        });
    }
    notifyGroupUpdated(groupId, updates, updatedBy) {
        this.server.to(`group:${groupId}`).emit('group-updated', {
            groupId,
            updates,
            updatedBy,
            timestamp: new Date().toISOString(),
        });
    }
    notifyGroupDeleted(groupId, deletedBy) {
        this.server.to(`group:${groupId}`).emit('group-deleted', {
            groupId,
            deletedBy,
            timestamp: new Date().toISOString(),
        });
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(`user:${userId}`).emit('notification', {
            ...notification,
            timestamp: new Date().toISOString(),
        });
    }
    getOnlineGroupMembers(groupId) {
        const roomSockets = this.server.sockets.adapter.rooms.get(`group:${groupId}`);
        if (!roomSockets)
            return [];
        const onlineMembers = [];
        for (const socketId of roomSockets) {
            const user = this.connectedUsers.get(socketId);
            if (user && user.isOnline) {
                onlineMembers.push(user.id);
            }
        }
        return onlineMembers;
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('newMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleNewMessage", null);
__decorate([
    SubscribeMessage('typing'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    SubscribeMessage('joinRoom'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    SubscribeMessage('leaveRoom'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    SubscribeMessage('getOnlineUsers'),
    __param(0, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    SubscribeMessage('joinGroupChat'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinGroupChat", null);
__decorate([
    SubscribeMessage('leaveGroupChat'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveGroupChat", null);
__decorate([
    SubscribeMessage('sendGroupMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendGroupMessage", null);
__decorate([
    SubscribeMessage('groupTyping'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleGroupTyping", null);
__decorate([
    SubscribeMessage('getGroupMembers'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetGroupMembers", null);
__decorate([
    SubscribeMessage('deleteGroupMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeleteGroupMessage", null);
ChatGateway = ChatGateway_1 = __decorate([
    WebSocketGateway({
        port: 3000,
        namespace: '/chat',
        cors: {
            origin: '*',
            credentials: true
        },
        transports: ['websocket', 'polling']
    }),
    __metadata("design:paramtypes", [JwtService,
        GroupChatService])
], ChatGateway);
export { ChatGateway };
//# sourceMappingURL=chat-gateway.js.map