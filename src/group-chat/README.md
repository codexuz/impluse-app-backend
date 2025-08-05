# Group Chat API

This module provides a comprehensive group chat system with message management and member administration features.

## Features

- **Group Chat Management**: Create, read, update, and delete group chats
- **Message System**: Send, edit, and delete messages within groups
- **Member Management**: Add/remove members and manage roles (admin/member)
- **Role-Based Access Control**: JWT authentication with role-based permissions
- **Pagination**: All list endpoints support pagination
- **Swagger Documentation**: Comprehensive API documentation

## Models

### GroupChat
- `id`: UUID (Primary Key)
- `name`: Group name (required)
- `description`: Group description (optional)
- `image_url`: Group image URL (optional)
- `link`: Group link (optional)
- `isPrivate`: Whether the group is private (default: false)

### Messages
- `id`: UUID (Primary Key)
- `group_id`: Reference to GroupChat
- `sender_id`: Reference to User
- `content`: Message content (required)
- `message_type`: Type of message (text, image, file, video, audio)

### GroupChatMembers
- `id`: UUID (Primary Key)
- `group_id`: Reference to GroupChat
- `user_id`: Reference to User
- `role`: Member role (admin, member)

## API Endpoints

### Group Chat Management

#### Create Group Chat
```
POST /group-chat
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Body**: CreateGroupChatDto
- **Response**: GroupChatResponseDto

#### Get User's Group Chats
```
GET /group-chat?page=1&limit=10
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Query**: PaginationDto
- **Response**: PaginatedResponseDto<GroupChatResponseDto>

#### Get Specific Group Chat
```
GET /group-chat/:id
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Params**: id (UUID)
- **Response**: GroupChatResponseDto

#### Update Group Chat
```
PATCH /group-chat/:id
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group admins can update
- **Params**: id (UUID)
- **Body**: UpdateGroupChatDto
- **Response**: GroupChatResponseDto

#### Delete Group Chat
```
DELETE /group-chat/:id
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group admins can delete
- **Params**: id (UUID)
- **Response**: SuccessResponseDto

### Message Management

#### Send Message
```
POST /group-chat/:groupId/messages
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group members can send messages
- **Params**: groupId (UUID)
- **Body**: CreateMessageDto
- **Response**: MessageResponseDto

#### Get Messages
```
GET /group-chat/:groupId/messages?page=1&limit=10
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group members can view messages
- **Params**: groupId (UUID)
- **Query**: PaginationDto
- **Response**: PaginatedResponseDto<MessageResponseDto>

#### Update Message
```
PATCH /group-chat/messages/:messageId
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only message sender can update
- **Params**: messageId (UUID)
- **Body**: UpdateMessageDto
- **Response**: MessageResponseDto

#### Delete Message
```
DELETE /group-chat/messages/:messageId
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Message sender or group admin can delete
- **Params**: messageId (UUID)
- **Response**: SuccessResponseDto

### Member Management

#### Add Member
```
POST /group-chat/:groupId/members
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group admins can add members
- **Params**: groupId (UUID)
- **Body**: AddGroupMemberDto
- **Response**: GroupMemberResponseDto

#### Get Members
```
GET /group-chat/:groupId/members?page=1&limit=10
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group members can view member list
- **Params**: groupId (UUID)
- **Query**: PaginationDto
- **Response**: PaginatedResponseDto<GroupMemberResponseDto>

#### Update Member Role
```
PATCH /group-chat/:groupId/members/:memberId/role
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Only group admins can update roles
- **Params**: groupId (UUID), memberId (UUID)
- **Body**: UpdateMemberRoleDto
- **Response**: SuccessResponseDto

#### Remove Member
```
DELETE /group-chat/:groupId/members/:memberId
```
- **Auth**: Required (JWT)
- **Roles**: student, teacher, admin
- **Restriction**: Group admins can remove any member, users can remove themselves
- **Params**: groupId (UUID), memberId (UUID)
- **Response**: SuccessResponseDto

## DTOs

### CreateGroupChatDto
```typescript
{
  name: string; // required
  description?: string;
  image_url?: string;
  link?: string;
  isPrivate?: boolean; // default: false
}
```

### CreateMessageDto
```typescript
{
  group_id: string; // UUID, automatically set from URL parameter
  content: string; // required
  message_type?: MessageType; // default: 'text'
}
```

### AddGroupMemberDto
```typescript
{
  user_id: string; // UUID, required
  role?: MemberRole; // default: 'member'
}
```

### PaginationDto
```typescript
{
  page?: number; // default: 1, min: 1
  limit?: number; // default: 10, min: 1, max: 100
}
```

## Enums

### MessageType
- `text`
- `image`
- `file`
- `video`
- `audio`

### MemberRole
- `admin`
- `member`

## Security & Permissions

### JWT Authentication
All endpoints require valid JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Role-Based Access Control
- **student**: Can participate in groups they're members of
- **teacher**: Can participate in groups they're members of
- **admin**: Can participate in groups they're members of

### Group-Level Permissions
- **View Group**: Must be a member
- **Send Messages**: Must be a member
- **Update Group**: Must be a group admin
- **Delete Group**: Must be a group admin
- **Add Members**: Must be a group admin
- **Remove Members**: Must be a group admin (or self-removal)
- **Update Member Roles**: Must be a group admin
- **Edit Messages**: Must be the message sender
- **Delete Messages**: Must be the message sender or group admin

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid JWT)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

## Usage Examples

### Create a Study Group
```javascript
const response = await fetch('/group-chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Math Study Group',
    description: 'Weekly math homework discussions',
    isPrivate: false
  })
});
```

### Send a Message
```javascript
const response = await fetch('/group-chat/550e8400-e29b-41d4-a716-446655440000/messages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Hello everyone! Ready for today\'s study session?',
    message_type: 'text'
  })
});
```

### Add a Member
```javascript
const response = await fetch('/group-chat/550e8400-e29b-41d4-a716-446655440000/members', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: '660e8400-e29b-41d4-a716-446655440001',
    role: 'member'
  })
});
```
