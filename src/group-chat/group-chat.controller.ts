import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GroupChatService } from './group-chat.service.js';
import { CreateGroupChatDto } from './dto/create-group-chat.dto.js';
import { UpdateGroupChatDto } from './dto/update-group-chat.dto.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { AddGroupMemberDto, UpdateMemberRoleDto } from './dto/group-member.dto.js';
import { PaginationDto } from './dto/pagination.dto.js';
import { 
  GroupChatResponseDto, 
  MessageResponseDto, 
  GroupMemberResponseDto, 
  PaginatedResponseDto,
  SuccessResponseDto 
} from './dto/response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Group Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('group-chat')
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}

  // Group Chat Endpoints
  @Post()
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new group chat' })
  @ApiResponse({ status: 201, description: 'Group chat created successfully', type: GroupChatResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createGroupChatDto: CreateGroupChatDto, @Request() req) {
    return this.groupChatService.create(createGroupChatDto, req.user.userId);
  }

  @Get()
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get all group chats for the current user' })
  @ApiResponse({ status: 200, description: 'Group chats retrieved successfully', type: PaginatedResponseDto<GroupChatResponseDto> })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(@Query() pagination: PaginationDto, @Request() req) {
    return this.groupChatService.findAll(req.user.userId, pagination);
  }

  @Get(':id')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get a specific group chat' })
  @ApiResponse({ status: 200, description: 'Group chat retrieved successfully', type: GroupChatResponseDto })
  @ApiResponse({ status: 404, description: 'Group chat not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' })
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.groupChatService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update a group chat (Admin only)' })
  @ApiResponse({ status: 200, description: 'Group chat updated successfully', type: GroupChatResponseDto })
  @ApiResponse({ status: 404, description: 'Group chat not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can update' })
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateGroupChatDto: UpdateGroupChatDto,
    @Request() req
  ) {
    return this.groupChatService.update(id, updateGroupChatDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a group chat (Admin only)' })
  @ApiResponse({ status: 200, description: 'Group chat deleted successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Group chat not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can delete' })
  @ApiParam({ name: 'id', description: 'Group chat ID' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.groupChatService.remove(id, req.user.userId);
  }

  // Message Endpoints
  @Post(':groupId/messages')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Send a message to a group' })
  @ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  createMessage(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    // Ensure the group_id in the DTO matches the URL parameter
    createMessageDto.group_id = groupId;
    return this.groupChatService.createMessage(createMessageDto, req.user.userId);
  }

  @Get(':groupId/messages')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get messages from a group' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: PaginatedResponseDto<MessageResponseDto> })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  getMessages(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query() pagination: PaginationDto,
    @Request() req
  ) {
    return this.groupChatService.getMessages(groupId, req.user.userId, pagination);
  }

  @Patch('messages/:messageId')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update a message (Own messages only)' })
  @ApiResponse({ status: 200, description: 'Message updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own messages' })
  @ApiParam({ name: 'messageId', description: 'Message ID' })
  updateMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req
  ) {
    return this.groupChatService.updateMessage(messageId, updateMessageDto, req.user.userId);
  }

  @Delete('messages/:messageId')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a message (Own messages or group admin)' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own messages or be group admin' })
  @ApiParam({ name: 'messageId', description: 'Message ID' })
  deleteMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Request() req
  ) {
    return this.groupChatService.deleteMessage(messageId, req.user.userId);
  }

  // Member Management Endpoints
  @Post(':groupId/members')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Add a member to the group (Admin only)' })
  @ApiResponse({ status: 201, description: 'Member added successfully', type: GroupMemberResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can add members' })
  @ApiResponse({ status: 400, description: 'User is already a member' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  addMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body() addMemberDto: AddGroupMemberDto,
    @Request() req
  ) {
    return this.groupChatService.addMember(groupId, addMemberDto, req.user.userId);
  }

  @Get(':groupId/members')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN )
  @ApiOperation({ summary: 'Get all members of a group' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: PaginatedResponseDto<GroupMemberResponseDto> })
  @ApiResponse({ status: 403, description: 'Forbidden - Not a member of this group' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  getMembers(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query() pagination: PaginationDto,
    @Request() req
  ) {
    return this.groupChatService.getMembers(groupId, req.user.userId, pagination);
  }

  @Patch(':groupId/members/:memberId/role')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update member role (Admin only)' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can update roles' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  @ApiParam({ name: 'memberId', description: 'Member user ID' })
  updateMemberRole(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() updateRoleDto: UpdateMemberRoleDto,
    @Request() req
  ) {
    return this.groupChatService.updateMemberRole(groupId, memberId, updateRoleDto, req.user.userId);
  }

  @Delete(':groupId/members/:memberId')
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Remove a member from the group (Admin only or self-removal)' })
  @ApiResponse({ status: 200, description: 'Member removed successfully', type: SuccessResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admins can remove members or self-removal' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  @ApiParam({ name: 'groupId', description: 'Group chat ID' })
  @ApiParam({ name: 'memberId', description: 'Member user ID' })
  removeMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Request() req
  ) {
    return this.groupChatService.removeMember(groupId, memberId, req.user.userId);
  }
}
