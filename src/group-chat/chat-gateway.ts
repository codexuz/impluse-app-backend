import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { GroupChatService } from './group-chat.service.js';
import { CreateMessageDto, MessageType } from './dto/create-message.dto.js';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
}

interface ChatUser {
  id: string;
  socketId: string;
  username: string;
  role: string;
  first_name?: string;
  last_name?: string;
  joinedAt: Date;
  isOnline: boolean;
}

interface GroupChatMessage {
  id: string;
  content: string;
  message_type: MessageType;
  sender_id: string;
  chat_group_id: string;
  username: string;
  role: string;
  timestamp: string;
  clientId: string;
}

interface ChatMessage {
  id: string;
  text: string;
  username: string;
  userId: string;
  role: string;
  timestamp: string;
  clientId: string;
  type: 'message' | 'system' | 'announcement';
}

@WebSocketGateway({
  port: 3000,
  namespace: '/chat',
  cors: { 
    origin: '*',
    credentials: true 
  },
  transports: ['websocket', 'polling']
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<string, ChatUser>();

  constructor(
    private jwtService: JwtService,
    private groupChatService: GroupChatService
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat Gateway initialized on port 3000 with namespace /chat');
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} attempted to connect without token`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);
      client.user = {
        id: payload.sub || payload.user_id,
        username: payload.username,
        role: payload.role,
        first_name: payload.first_name,
        last_name: payload.last_name,
      };

      // Add user to connected users map
      const chatUser: ChatUser = {
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

      // Join user to role-based room
      await client.join(`role:${client.user.role}`);
      await client.join(`user:${client.user.id}`);

      this.logger.log(`User ${client.user.username} (${client.user.role}) connected: ${client.id}`);

      // Notify others about new user
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

      // Send welcome message to user
      client.emit('welcome', {
        message: `Welcome to the chat, ${client.user.first_name || client.user.username}!`,
        onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
        timestamp: new Date().toISOString(),
      });

      // Send online users list
      this.server.emit('users-update', {
        onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
      });

    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const user = this.connectedUsers.get(client.id);
    
    if (user) {
      this.connectedUsers.delete(client.id);
      
      this.logger.log(`User ${user.username} disconnected: ${client.id}`);

      // Notify others about user leaving general chat
      client.broadcast.emit('user-left', {
        message: `${user.first_name || user.username} left the chat`,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        timestamp: new Date().toISOString(),
      });

      // Notify all group chats that the user went offline
      this.server.emit('member-offline-global', {
        user: {
          id: user.id,
          username: user.username,
        },
        timestamp: new Date().toISOString(),
      });

      // Update online users list
      this.server.emit('users-update', {
        onlineUsers: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
      });
    }
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() messageData: { text: string; type?: 'message' | 'announcement' }
  ): Promise<void> {
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

    // Check if user has permission for announcements
    if (type === 'announcement' && !['admin', 'teacher', 'support_teacher'].includes(client.user.role)) {
      client.emit('error', { message: 'Insufficient permissions for announcements' });
      return;
    }

    const message: ChatMessage = {
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

    // Broadcast message to all connected clients
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

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { isTyping: boolean }
  ): void {
    if (!client.user) return;

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

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string }
  ): Promise<void> {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Only allow joining rooms based on role permissions
    const allowedRooms = this.getAllowedRooms(client.user.role);
    
    if (!allowedRooms.includes(data.roomId)) {
      client.emit('error', { message: 'Access denied to this room' });
      return;
    }

    await client.join(data.roomId);
    client.emit('room-joined', { roomId: data.roomId });
    
    this.logger.log(`User ${client.user.username} joined room: ${data.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string }
  ): Promise<void> {
    if (!client.user) return;

    await client.leave(data.roomId);
    client.emit('room-left', { roomId: data.roomId });
    
    this.logger.log(`User ${client.user.username} left room: ${data.roomId}`);
  }

  @SubscribeMessage('getOnlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket): void {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    client.emit('online-users', {
      users: Array.from(this.connectedUsers.values()).filter(u => u.isOnline),
    });
  }

  // Group Chat WebSocket Handlers
  @SubscribeMessage('joinGroupChat')
  async handleJoinGroupChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: string }
  ): Promise<void> {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      // Verify user is member of the group using service
      await this.groupChatService.findOne(data.groupId, client.user.id);
      
      // Join the group room
      await client.join(`group:${data.groupId}`);
      
      client.emit('group-joined', { 
        groupId: data.groupId,
        message: 'Successfully joined group chat'
      });
      
      // Notify other group members
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
    } catch (error) {
      client.emit('error', { 
        message: 'Failed to join group chat: ' + error.message 
      });
    }
  }

  @SubscribeMessage('leaveGroupChat')
  async handleLeaveGroupChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: string }
  ): Promise<void> {
    if (!client.user) return;

    await client.leave(`group:${data.groupId}`);
    
    client.emit('group-left', { 
      groupId: data.groupId,
      message: 'Left group chat'
    });
    
    // Notify other group members
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

  @SubscribeMessage('sendGroupMessage')
  async handleSendGroupMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() messageData: { 
      groupId: string; 
      content: string; 
      message_type?: MessageType;
    }
  ): Promise<void> {
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
      // Create message using service
      const createMessageDto: CreateMessageDto = {
        group_id: groupId,
        content: content.trim(),
        message_type,
      };

      const savedMessage = await this.groupChatService.createMessage(
        createMessageDto, 
        client.user.id
      );

      // Create the message object for real-time broadcast
      const groupMessage: GroupChatMessage = {
        id: savedMessage.id,
        content: savedMessage.content,
        message_type: savedMessage.message_type as MessageType,
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

      // Broadcast to all group members
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
    } catch (error) {
      client.emit('error', { 
        message: 'Failed to send message: ' + error.message 
      });
    }
  }

  @SubscribeMessage('groupTyping')
  handleGroupTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: string; isTyping: boolean }
  ): void {
    if (!client.user) return;

    // Broadcast typing indicator to other group members only
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

  @SubscribeMessage('getGroupMembers')
  async handleGetGroupMembers(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { groupId: string }
  ): Promise<void> {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      const members = await this.groupChatService.getMembers(
        data.groupId, 
        client.user.id, 
        { page: 1, limit: 100 }
      );

      // Get online status for each member
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
    } catch (error) {
      client.emit('error', { 
        message: 'Failed to get group members: ' + error.message 
      });
    }
  }

  @SubscribeMessage('deleteGroupMessage')
  async handleDeleteGroupMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string; groupId: string }
  ): Promise<void> {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      await this.groupChatService.deleteMessage(data.messageId, client.user.id);

      // Notify all group members about message deletion
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
    } catch (error) {
      client.emit('error', { 
        message: 'Failed to delete message: ' + error.message 
      });
    }
  }

  // Private helper methods
  private getAllowedRooms(role: string): string[] {
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

  // Public method to send system announcements
  public sendSystemAnnouncement(message: string, targetRole?: string): void {
    const announcement = {
      id: `sys_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: message,
      username: 'System',
      userId: 'system',
      role: 'system',
      timestamp: new Date().toISOString(),
      clientId: 'system',
      type: 'system' as const,
    };

    if (targetRole) {
      this.server.to(`role:${targetRole}`).emit('message', announcement);
    } else {
      this.server.emit('message', announcement);
    }
  }

  // Group-specific notification methods
  public notifyGroupMemberAdded(groupId: string, newMember: any, addedBy: any): void {
    this.server.to(`group:${groupId}`).emit('member-added', {
      groupId,
      newMember,
      addedBy,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyGroupMemberRemoved(groupId: string, removedMember: any, removedBy: any): void {
    this.server.to(`group:${groupId}`).emit('member-removed', {
      groupId,
      removedMember,
      removedBy,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyGroupUpdated(groupId: string, updates: any, updatedBy: any): void {
    this.server.to(`group:${groupId}`).emit('group-updated', {
      groupId,
      updates,
      updatedBy,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyGroupDeleted(groupId: string, deletedBy: any): void {
    this.server.to(`group:${groupId}`).emit('group-deleted', {
      groupId,
      deletedBy,
      timestamp: new Date().toISOString(),
    });
  }

  // Send notification to specific user
  public sendNotificationToUser(userId: string, notification: any): void {
    this.server.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Get online users in a specific group
  public getOnlineGroupMembers(groupId: string): string[] {
    const roomSockets = this.server.sockets.adapter.rooms.get(`group:${groupId}`);
    if (!roomSockets) return [];

    const onlineMembers: string[] = [];
    for (const socketId of roomSockets) {
      const user = this.connectedUsers.get(socketId);
      if (user && user.isOnline) {
        onlineMembers.push(user.id);
      }
    }
    
    return onlineMembers;
  }
}