import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupChatDto } from './dto/create-group-chat.dto.js';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { AddGroupMemberDto, UpdateMemberRoleDto, MemberRole } from './dto/group-member.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { GroupChat } from './entities/group-chat.entity.js';
import { Messages } from './entities/messages.js';
import { GroupChatMembers } from './entities/chat_group_members.js';

@Injectable()
export class GroupChatService {
  constructor(
    @InjectModel(GroupChat)
    private groupChatModel: typeof GroupChat,
    @InjectModel(Messages)
    private messagesModel: typeof Messages,
    @InjectModel(GroupChatMembers)
    private groupChatMembersModel: typeof GroupChatMembers,
  ) {}

  // Group Chat CRUD Operations
  async create(createGroupChatDto: CreateGroupChatDto, userId: string) {
    console.log('GroupChatService.create - userId:', userId);
    console.log('GroupChatService.create - typeof userId:', typeof userId);
    
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const groupChat = await this.groupChatModel.create({
      ...createGroupChatDto,
    });

    // Add creator as admin
    await this.groupChatMembersModel.create({
      chat_group_id: groupChat.id,
      user_id: userId,
      role: MemberRole.ADMIN,
    });

    return groupChat;
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Find groups where user is a member
    const userGroups = await this.groupChatMembersModel.findAll({
      where: { user_id: userId },
      attributes: ['chat_group_id'],
    });

    const groupIds = userGroups.map(ug => ug.chat_group_id);

    const { count, rows } = await this.groupChatModel.findAndCountAll({
      where: {
        id: groupIds,
      },
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string, userId: string) {
    // Check if user is member of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: id, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const groupChat = await this.groupChatModel.findByPk(id);
    if (!groupChat) {
      throw new NotFoundException('Group chat not found');
    }

    return groupChat;
  }

  async update(id: string, updateGroupChatDto: UpdateGroupChatDto, userId: string) {
    // Check if user is admin of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: id, user_id: userId, role: MemberRole.ADMIN },
    });

    if (!membership) {
      throw new ForbiddenException('Only group admins can update group details');
    }

    const [updatedRowsCount] = await this.groupChatModel.update(
      updateGroupChatDto,
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      throw new NotFoundException('Group chat not found');
    }

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    // Check if user is admin of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: id, user_id: userId, role: MemberRole.ADMIN },
    });

    if (!membership) {
      throw new ForbiddenException('Only group admins can delete the group');
    }

    const deletedRowsCount = await this.groupChatModel.destroy({
      where: { id }
    });

    if (deletedRowsCount === 0) {
      throw new NotFoundException('Group chat not found');
    }

    return { message: 'Group chat deleted successfully' };
  }

  // Message Operations
  async createMessage(createMessageDto: CreateMessageDto, userId: string) {
    // Check if user is member of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: createMessageDto.group_id, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const message = await this.messagesModel.create({
      chat_group_id: createMessageDto.group_id,
      content: createMessageDto.content,
      message_type: createMessageDto.message_type,
      sender_id: userId,
    });

    return message;
  }

  async getMessages(groupId: string, userId: string, pagination: PaginationDto) {
    // Check if user is member of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.messagesModel.findAndCountAll({
      where: { chat_group_id: groupId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async updateMessage(messageId: string, updateMessageDto: UpdateMessageDto, userId: string) {
    const message = await this.messagesModel.findByPk(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== userId) {
      throw new ForbiddenException('You can only update your own messages');
    }

    await message.update(updateMessageDto);
    return message;
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messagesModel.findByPk(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is sender or group admin
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: message.chat_group_id, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    if (message.sender_id !== userId && membership.role !== MemberRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own messages or be a group admin');
    }

    await message.destroy();
    return { message: 'Message deleted successfully' };
  }

  // Group Member Operations
  async addMember(groupId: string, addMemberDto: AddGroupMemberDto, userId: string) {
    // Check if user is admin of the group
    const adminMembership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: userId, role: MemberRole.ADMIN },
    });

    if (!adminMembership) {
      throw new ForbiddenException('Only group admins can add members');
    }

    // Check if user is already a member
    const existingMembership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: addMemberDto.user_id },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this group');
    }

    const member = await this.groupChatMembersModel.create({
      chat_group_id: groupId,
      user_id: addMemberDto.user_id,
      role: addMemberDto.role || MemberRole.MEMBER,
    });

    return member;
  }

  async getMembers(groupId: string, userId: string, pagination: PaginationDto) {
    // Check if user is member of the group
    const membership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.groupChatMembersModel.findAndCountAll({
      where: { chat_group_id: groupId },
      limit,
      offset,
      order: [['createdAt', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async updateMemberRole(groupId: string, memberId: string, updateRoleDto: UpdateMemberRoleDto, userId: string) {
    // Check if user is admin of the group
    const adminMembership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: userId, role: MemberRole.ADMIN },
    });

    if (!adminMembership) {
      throw new ForbiddenException('Only group admins can update member roles');
    }

    const [updatedRowsCount] = await this.groupChatMembersModel.update(
      { role: updateRoleDto.role },
      { where: { chat_group_id: groupId, user_id: memberId } }
    );

    if (updatedRowsCount === 0) {
      throw new NotFoundException('Member not found in this group');
    }

    return { message: 'Member role updated successfully' };
  }

  async removeMember(groupId: string, memberId: string, userId: string) {
    // Check if user is admin of the group or removing themselves
    const adminMembership = await this.groupChatMembersModel.findOne({
      where: { chat_group_id: groupId, user_id: userId, role: MemberRole.ADMIN },
    });

    if (!adminMembership && userId !== memberId) {
      throw new ForbiddenException('Only group admins can remove members or you can remove yourself');
    }

    const deletedRowsCount = await this.groupChatMembersModel.destroy({
      where: { chat_group_id: groupId, user_id: memberId }
    });

    if (deletedRowsCount === 0) {
      throw new NotFoundException('Member not found in this group');
    }

    return { message: 'Member removed successfully' };
  }
}
