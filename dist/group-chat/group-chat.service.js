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
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MemberRole } from './dto/group-member.dto.js';
import { GroupChat } from './entities/group-chat.entity.js';
import { Messages } from './entities/messages.js';
import { GroupChatMembers } from './entities/chat_group_members.js';
let GroupChatService = class GroupChatService {
    constructor(groupChatModel, messagesModel, groupChatMembersModel) {
        this.groupChatModel = groupChatModel;
        this.messagesModel = messagesModel;
        this.groupChatMembersModel = groupChatMembersModel;
    }
    async create(createGroupChatDto, userId) {
        console.log('GroupChatService.create - userId:', userId);
        console.log('GroupChatService.create - typeof userId:', typeof userId);
        if (!userId) {
            throw new BadRequestException('User ID is required');
        }
        const groupChat = await this.groupChatModel.create({
            ...createGroupChatDto,
        });
        await this.groupChatMembersModel.create({
            chat_group_id: groupChat.id,
            user_id: userId,
            role: MemberRole.ADMIN,
        });
        return groupChat;
    }
    async findAll(userId, pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
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
    async findOne(id, userId) {
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
    async update(id, updateGroupChatDto, userId) {
        const membership = await this.groupChatMembersModel.findOne({
            where: { chat_group_id: id, user_id: userId, role: MemberRole.ADMIN },
        });
        if (!membership) {
            throw new ForbiddenException('Only group admins can update group details');
        }
        const [updatedRowsCount] = await this.groupChatModel.update(updateGroupChatDto, { where: { id } });
        if (updatedRowsCount === 0) {
            throw new NotFoundException('Group chat not found');
        }
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
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
    async createMessage(createMessageDto, userId) {
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
    async getMessages(groupId, userId, pagination) {
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
    async updateMessage(messageId, updateMessageDto, userId) {
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
    async deleteMessage(messageId, userId) {
        const message = await this.messagesModel.findByPk(messageId);
        if (!message) {
            throw new NotFoundException('Message not found');
        }
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
    async addMember(groupId, addMemberDto, userId) {
        const adminMembership = await this.groupChatMembersModel.findOne({
            where: { chat_group_id: groupId, user_id: userId, role: MemberRole.ADMIN },
        });
        if (!adminMembership) {
            throw new ForbiddenException('Only group admins can add members');
        }
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
    async getMembers(groupId, userId, pagination) {
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
    async updateMemberRole(groupId, memberId, updateRoleDto, userId) {
        const adminMembership = await this.groupChatMembersModel.findOne({
            where: { chat_group_id: groupId, user_id: userId, role: MemberRole.ADMIN },
        });
        if (!adminMembership) {
            throw new ForbiddenException('Only group admins can update member roles');
        }
        const [updatedRowsCount] = await this.groupChatMembersModel.update({ role: updateRoleDto.role }, { where: { chat_group_id: groupId, user_id: memberId } });
        if (updatedRowsCount === 0) {
            throw new NotFoundException('Member not found in this group');
        }
        return { message: 'Member role updated successfully' };
    }
    async removeMember(groupId, memberId, userId) {
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
};
GroupChatService = __decorate([
    Injectable(),
    __param(0, InjectModel(GroupChat)),
    __param(1, InjectModel(Messages)),
    __param(2, InjectModel(GroupChatMembers)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GroupChatService);
export { GroupChatService };
//# sourceMappingURL=group-chat.service.js.map