# Group Chat Gateway Integration

This document explains how to use the integrated WebSocket chat gateway with the GroupChatService.

## Overview

The `ChatGateway` now integrates with `GroupChatService` to provide:
- Real-time group chat messaging
- Group member management
- Online status tracking
- Message persistence through the service layer

## WebSocket Events

### Client → Server Events

#### Group Chat Management
```javascript
// Join a group chat room
socket.emit('joinGroupChat', { groupId: 'group-uuid' });

// Leave a group chat room
socket.emit('leaveGroupChat', { groupId: 'group-uuid' });

// Send a message to a group
socket.emit('sendGroupMessage', {
  groupId: 'group-uuid',
  content: 'Hello everyone!',
  message_type: 'text' // 'text', 'image', 'file', 'video', 'audio'
});

// Show typing indicator in group
socket.emit('groupTyping', {
  groupId: 'group-uuid',
  isTyping: true
});

// Get group members list
socket.emit('getGroupMembers', { groupId: 'group-uuid' });

// Delete a message (own messages or group admin)
socket.emit('deleteGroupMessage', {
  messageId: 'message-uuid',
  groupId: 'group-uuid'
});
```

#### General Chat (existing functionality)
```javascript
// Send message to general chat
socket.emit('newMessage', {
  text: 'Hello everyone!',
  type: 'message' // 'message', 'announcement'
});

// Show typing in general chat
socket.emit('typing', { isTyping: true });

// Join/leave general rooms
socket.emit('joinRoom', { roomId: 'general' });
socket.emit('leaveRoom', { roomId: 'general' });

// Get online users
socket.emit('getOnlineUsers');
```

### Server → Client Events

#### Group Chat Events
```javascript
// Successfully joined group
socket.on('group-joined', (data) => {
  console.log('Joined group:', data.groupId);
});

// New group message received
socket.on('groupMessage', (data) => {
  console.log('New message:', data.content);
  console.log('From:', data.user.username);
  console.log('Group:', data.chat_group_id);
});

// Member joined group
socket.on('member-online', (data) => {
  console.log('Member online:', data.user.username);
});

// Member left group
socket.on('member-offline', (data) => {
  console.log('Member offline:', data.user.username);
});

// Someone is typing in group
socket.on('group-user-typing', (data) => {
  console.log('User typing:', data.user.username);
});

// Group members list
socket.on('group-members', (data) => {
  console.log('Members:', data.members);
  console.log('Total:', data.total);
});

// Message was deleted
socket.on('messageDeleted', (data) => {
  console.log('Message deleted:', data.messageId);
});

// Group management notifications
socket.on('member-added', (data) => {
  console.log('New member added:', data.newMember);
});

socket.on('member-removed', (data) => {
  console.log('Member removed:', data.removedMember);
});

socket.on('group-updated', (data) => {
  console.log('Group updated:', data.updates);
});

socket.on('group-deleted', (data) => {
  console.log('Group deleted:', data.groupId);
});
```

#### General Chat Events (existing)
```javascript
socket.on('message', (data) => {
  console.log('General chat message:', data.text);
});

socket.on('user-joined', (data) => {
  console.log('User joined:', data.user.username);
});

socket.on('welcome', (data) => {
  console.log('Welcome message:', data.message);
});

socket.on('online-users', (data) => {
  console.log('Online users:', data.users);
});
```

## Authentication

All WebSocket connections require JWT authentication:

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Or via headers
const socket = io('http://localhost:3000/chat', {
  extraHeaders: {
    Authorization: 'Bearer your-jwt-token'
  }
});
```

## Integration with Service Layer

The gateway integrates seamlessly with GroupChatService:

- **Message Persistence**: All group messages are saved to database via `GroupChatService.createMessage()`
- **Permission Checking**: Group membership is verified before allowing join/send operations
- **Member Management**: Real-time notifications when members are added/removed
- **Message Deletion**: Handles both user and admin message deletion

## Server-Side Methods

The gateway exposes public methods for server-side use:

```typescript
// Send system announcements
chatGateway.sendSystemAnnouncement('Server maintenance in 10 minutes');

// Group-specific notifications
chatGateway.notifyGroupMemberAdded(groupId, newMember, addedBy);
chatGateway.notifyGroupMemberRemoved(groupId, removedMember, removedBy);
chatGateway.notifyGroupUpdated(groupId, updates, updatedBy);

// Send notification to specific user
chatGateway.sendNotificationToUser(userId, notification);

// Get online members in a group
const onlineMembers = chatGateway.getOnlineGroupMembers(groupId);
```

## Error Handling

The gateway emits error events for various scenarios:

```javascript
socket.on('error', (error) => {
  console.error('Chat error:', error.message);
  // Handle specific errors:
  // - 'Unauthorized'
  // - 'Message content cannot be empty'
  // - 'Failed to join group chat: ...'
  // - 'Failed to send message: ...'
});
```

## Example Client Implementation

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: { token: localStorage.getItem('jwt') }
});

// Join a group when component mounts
function joinGroup(groupId) {
  socket.emit('joinGroupChat', { groupId });
}

// Send message
function sendMessage(groupId, content) {
  socket.emit('sendGroupMessage', {
    groupId,
    content,
    message_type: 'text'
  });
}

// Listen for new messages
socket.on('groupMessage', (message) => {
  addMessageToUI(message);
});

// Handle typing indicators
socket.on('group-user-typing', (data) => {
  showTypingIndicator(data.user.username, data.isTyping);
});
```

## Migration from Old Chat

If migrating from an existing chat system:

1. Keep existing general chat functionality unchanged
2. Add group-specific event handlers
3. Update UI to distinguish between general and group messages
4. Use group rooms (`group:${groupId}`) for group-specific communications

The gateway maintains full backward compatibility with existing general chat functionality.
