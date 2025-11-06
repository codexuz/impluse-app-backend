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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, ParseUUIDPipe, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, } from '@nestjs/swagger';
import { GroupChatService } from './group-chat.service.js';
import { CreateGroupChatDto } from './dto/create-group-chat.dto.js';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { AddGroupMemberDto, UpdateMemberRoleDto } from './dto/group-member.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { GroupChatResponseDto, MessageResponseDto, GroupMemberResponseDto, PaginatedResponseDto, SuccessResponseDto } from './dto/response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let GroupChatController = class GroupChatController {
    constructor(groupChatService) {
        this.groupChatService = groupChatService;
    }
    create(createGroupChatDto, req) {
        return this.groupChatService.create(createGroupChatDto, req.user.userId);
    }
    findAll(pagination, req) {
        return this.groupChatService.findAll(req.user.userId, pagination);
    }
    findOne(id, req) {
        return this.groupChatService.findOne(id, req.user.userId);
    }
    update(id, updateGroupChatDto, req) {
        return this.groupChatService.update(id, updateGroupChatDto, req.user.userId);
    }
    remove(id, req) {
        return this.groupChatService.remove(id, req.user.userId);
    }
    createMessage(groupId, createMessageDto, req) {
        createMessageDto.group_id = groupId;
        return this.groupChatService.createMessage(createMessageDto, req.user.userId);
    }
    getMessages(groupId, pagination, req) {
        return this.groupChatService.getMessages(groupId, req.user.userId, pagination);
    }
    updateMessage(messageId, updateMessageDto, req) {
        return this.groupChatService.updateMessage(messageId, updateMessageDto, req.user.userId);
    }
    deleteMessage(messageId, req) {
        return this.groupChatService.deleteMessage(messageId, req.user.userId);
    }
    addMember(groupId, addMemberDto, req) {
        return this.groupChatService.addMember(groupId, addMemberDto, req.user.userId);
    }
    getMembers(groupId, pagination, req) {
        return this.groupChatService.getMembers(groupId, req.user.userId, pagination);
    }
    updateMemberRole(groupId, memberId, updateRoleDto, req) {
        return this.groupChatService.updateMemberRole(groupId, memberId, updateRoleDto, req.user.userId);
    }
    removeMember(groupId, memberId, req) {
        return this.groupChatService.removeMember(groupId, memberId, req.user.userId);
    }
};
__decorate([
    Post(),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Create a new group chat' }),
    ApiResponse({ status: 201, description: 'Group chat created successfully', type: GroupChatResponseDto }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGroupChatDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Get all group chats for the current user' }),
    ApiResponse({ status: 200, description: 'Group chats retrieved successfully', type: (PaginatedResponseDto) }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, Query()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Get a specific group chat' }),
    ApiResponse({ status: 200, description: 'Group chat retrieved successfully', type: GroupChatResponseDto }),
    ApiResponse({ status: 404, description: 'Group chat not found' }),
    ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' }),
    ApiParam({ name: 'id', description: 'Group chat ID' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a group chat (Admin only)' }),
    ApiResponse({ status: 200, description: 'Group chat updated successfully', type: GroupChatResponseDto }),
    ApiResponse({ status: 404, description: 'Group chat not found' }),
    ApiResponse({ status: 403, description: 'Forbidden - Only admins can update' }),
    ApiParam({ name: 'id', description: 'Group chat ID' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateGroupChatDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a group chat (Admin only)' }),
    ApiResponse({ status: 200, description: 'Group chat deleted successfully', type: SuccessResponseDto }),
    ApiResponse({ status: 404, description: 'Group chat not found' }),
    ApiResponse({ status: 403, description: 'Forbidden - Only admins can delete' }),
    ApiParam({ name: 'id', description: 'Group chat ID' }),
    __param(0, Param('id', ParseUUIDPipe)),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "remove", null);
__decorate([
    Post(':groupId/messages'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Send a message to a group' }),
    ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageResponseDto }),
    ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "createMessage", null);
__decorate([
    Get(':groupId/messages'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Get messages from a group' }),
    ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: (PaginatedResponseDto) }),
    ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Query()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "getMessages", null);
__decorate([
    Patch('messages/:messageId'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Update a message (Own messages only)' }),
    ApiResponse({ status: 200, description: 'Message updated successfully', type: MessageResponseDto }),
    ApiResponse({ status: 404, description: 'Message not found' }),
    ApiResponse({ status: 403, description: 'Forbidden - Can only update own messages' }),
    ApiParam({ name: 'messageId', description: 'Message ID' }),
    __param(0, Param('messageId', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateMessageDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "updateMessage", null);
__decorate([
    Delete('messages/:messageId'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Delete a message (Own messages or group admin)' }),
    ApiResponse({ status: 200, description: 'Message deleted successfully', type: SuccessResponseDto }),
    ApiResponse({ status: 404, description: 'Message not found' }),
    ApiResponse({ status: 403, description: 'Forbidden - Can only delete own messages or be group admin' }),
    ApiParam({ name: 'messageId', description: 'Message ID' }),
    __param(0, Param('messageId', ParseUUIDPipe)),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "deleteMessage", null);
__decorate([
    Post(':groupId/members'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Add a member to the group (Admin only)' }),
    ApiResponse({ status: 201, description: 'Member added successfully', type: GroupMemberResponseDto }),
    ApiResponse({ status: 403, description: 'Forbidden - Only admins can add members' }),
    ApiResponse({ status: 400, description: 'User is already a member' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddGroupMemberDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "addMember", null);
__decorate([
    Get(':groupId/members'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Get all members of a group' }),
    ApiResponse({ status: 200, description: 'Members retrieved successfully', type: (PaginatedResponseDto) }),
    ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Query()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "getMembers", null);
__decorate([
    Patch(':groupId/members/:memberId/role'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Update member role (Admin only)' }),
    ApiResponse({ status: 200, description: 'Member role updated successfully', type: SuccessResponseDto }),
    ApiResponse({ status: 403, description: 'Forbidden - Only admins can update roles' }),
    ApiResponse({ status: 404, description: 'Member not found' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    ApiParam({ name: 'memberId', description: 'Member user ID' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Param('memberId', ParseUUIDPipe)),
    __param(2, Body()),
    __param(3, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, UpdateMemberRoleDto, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "updateMemberRole", null);
__decorate([
    Delete(':groupId/members/:memberId'),
    Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN),
    ApiOperation({ summary: 'Remove a member from the group (Admin only or self-removal)' }),
    ApiResponse({ status: 200, description: 'Member removed successfully', type: SuccessResponseDto }),
    ApiResponse({ status: 403, description: 'Forbidden - Only admins can remove members or self-removal' }),
    ApiResponse({ status: 404, description: 'Member not found' }),
    ApiParam({ name: 'groupId', description: 'Group chat ID' }),
    ApiParam({ name: 'memberId', description: 'Member user ID' }),
    __param(0, Param('groupId', ParseUUIDPipe)),
    __param(1, Param('memberId', ParseUUIDPipe)),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], GroupChatController.prototype, "removeMember", null);
GroupChatController = __decorate([
    ApiTags('Group Chat'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('group-chat'),
    __metadata("design:paramtypes", [GroupChatService])
], GroupChatController);
export { GroupChatController };
//# sourceMappingURL=group-chat.controller.js.map