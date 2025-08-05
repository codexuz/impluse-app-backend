# Group Chat WebSocket Client Example

This example demonstrates how to connect to and interact with the Group Chat WebSocket API.

## Installation

```bash
npm install socket.io-client
```

## Basic Usage

```javascript
import { io } from 'socket.io-client';

class GroupChatClient {
  constructor(token) {
    this.token = token;
    this.socket = null;
    this.currentGroups = new Set();
  }

  connect() {
    this.socket = io('ws://localhost:3001/group-chat', {
      auth: {
        token: this.token
      },
      transports: ['websocket', 'polling']
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to group chat server');
    });

    this.socket.on('connected', (data) => {
      console.log('Authentication successful:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from group chat server');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Group events
    this.socket.on('joined_group', (data) => {
      console.log('Joined group:', data);
      this.currentGroups.add(data.groupId);
    });

    this.socket.on('left_group', (data) => {
      console.log('Left group:', data);
      this.currentGroups.delete(data.groupId);
    });

    this.socket.on('user_joined_group', (data) => {
      console.log('User joined group:', data);
      this.onUserJoinedGroup(data);
    });

    this.socket.on('user_left_group', (data) => {
      console.log('User left group:', data);
      this.onUserLeftGroup(data);
    });

    // Message events
    this.socket.on('new_message', (message) => {
      console.log('New message:', message);
      this.onNewMessage(message);
    });

    // Typing indicators
    this.socket.on('user_typing_start', (data) => {
      console.log('User started typing:', data);
      this.onUserTypingStart(data);
    });

    this.socket.on('user_typing_stop', (data) => {
      console.log('User stopped typing:', data);
      this.onUserTypingStop(data);
    });

    // Online members
    this.socket.on('online_members', (data) => {
      console.log('Online members:', data);
      this.onOnlineMembersUpdate(data);
    });

    // Announcements
    this.socket.on('announcement', (announcement) => {
      console.log('Announcement:', announcement);
      this.onAnnouncement(announcement);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Group management
  joinGroup(groupId) {
    if (this.socket) {
      this.socket.emit('join_group', { groupId });
    }
  }

  leaveGroup(groupId) {
    if (this.socket) {
      this.socket.emit('leave_group', { groupId });
    }
  }

  // Messaging
  sendMessage(groupId, content, messageType = 'text') {
    if (this.socket && this.currentGroups.has(groupId)) {
      this.socket.emit('send_message', {
        groupId,
        content,
        message_type: messageType
      });
    } else {
      console.error('Not connected to group or not a member');
    }
  }

  // Typing indicators
  startTyping(groupId) {
    if (this.socket && this.currentGroups.has(groupId)) {
      this.socket.emit('typing_start', { groupId });
    }
  }

  stopTyping(groupId) {
    if (this.socket && this.currentGroups.has(groupId)) {
      this.socket.emit('typing_stop', { groupId });
    }
  }

  // Get online members
  getOnlineMembers(groupId) {
    if (this.socket) {
      this.socket.emit('get_online_members', { groupId });
    }
  }

  // Admin functions
  sendAnnouncement(groupId, message) {
    if (this.socket) {
      this.socket.emit('broadcast_announcement', { groupId, message });
    }
  }

  // Event handlers (override these in your implementation)
  onNewMessage(message) {
    // Handle new message
    console.log('Override this method to handle new messages');
  }

  onUserJoinedGroup(data) {
    // Handle user joining
    console.log('Override this method to handle user joining');
  }

  onUserLeftGroup(data) {
    // Handle user leaving
    console.log('Override this method to handle user leaving');
  }

  onUserTypingStart(data) {
    // Handle typing start
    console.log('Override this method to handle typing start');
  }

  onUserTypingStop(data) {
    // Handle typing stop
    console.log('Override this method to handle typing stop');
  }

  onOnlineMembersUpdate(data) {
    // Handle online members update
    console.log('Override this method to handle online members update');
  }

  onAnnouncement(announcement) {
    // Handle announcement
    console.log('Override this method to handle announcements');
  }
}

// Usage example
const token = 'your-jwt-token-here';
const chatClient = new GroupChatClient(token);

// Connect to the server
chatClient.connect();

// Join a group
setTimeout(() => {
  chatClient.joinGroup('550e8400-e29b-41d4-a716-446655440000');
}, 1000);

// Send a message
setTimeout(() => {
  chatClient.sendMessage(
    '550e8400-e29b-41d4-a716-446655440000', 
    'Hello everyone!'
  );
}, 2000);

export default GroupChatClient;
```

## React Hook Example

```javascript
import { useState, useEffect, useRef } from 'react';
import GroupChatClient from './GroupChatClient';

export const useGroupChat = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const [onlineMembers, setOnlineMembers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const chatClientRef = useRef(null);

  useEffect(() => {
    if (token) {
      chatClientRef.current = new GroupChatClient(token);
      
      // Override event handlers
      chatClientRef.current.onNewMessage = (message) => {
        setMessages(prev => ({
          ...prev,
          [message.group_id]: [
            ...(prev[message.group_id] || []),
            message
          ]
        }));
      };

      chatClientRef.current.onUserTypingStart = (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.groupId]: [
            ...(prev[data.groupId] || []).filter(u => u.id !== data.user.id),
            data.user
          ]
        }));
      };

      chatClientRef.current.onUserTypingStop = (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.groupId]: (prev[data.groupId] || []).filter(u => u.id !== data.user.id)
        }));
      };

      chatClientRef.current.onOnlineMembersUpdate = (data) => {
        setOnlineMembers(prev => ({
          ...prev,
          [data.groupId]: data.members
        }));
      };

      chatClientRef.current.connect();

      chatClientRef.current.socket.on('connect', () => setIsConnected(true));
      chatClientRef.current.socket.on('disconnect', () => setIsConnected(false));

      return () => {
        chatClientRef.current?.disconnect();
      };
    }
  }, [token]);

  const joinGroup = (groupId) => {
    chatClientRef.current?.joinGroup(groupId);
  };

  const leaveGroup = (groupId) => {
    chatClientRef.current?.leaveGroup(groupId);
  };

  const sendMessage = (groupId, content, messageType = 'text') => {
    chatClientRef.current?.sendMessage(groupId, content, messageType);
  };

  const startTyping = (groupId) => {
    chatClientRef.current?.startTyping(groupId);
  };

  const stopTyping = (groupId) => {
    chatClientRef.current?.stopTyping(groupId);
  };

  const getOnlineMembers = (groupId) => {
    chatClientRef.current?.getOnlineMembers(groupId);
  };

  return {
    isConnected,
    messages,
    onlineMembers,
    typingUsers,
    joinGroup,
    leaveGroup,
    sendMessage,
    startTyping,
    stopTyping,
    getOnlineMembers,
  };
};
```

## React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { useGroupChat } from './useGroupChat';

const GroupChatComponent = ({ token, groupId }) => {
  const [messageInput, setMessageInput] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const {
    isConnected,
    messages,
    onlineMembers,
    typingUsers,
    joinGroup,
    leaveGroup,
    sendMessage,
    startTyping,
    stopTyping,
    getOnlineMembers,
  } = useGroupChat(token);

  const groupMessages = messages[groupId] || [];
  const groupOnlineMembers = onlineMembers[groupId] || [];
  const groupTypingUsers = typingUsers[groupId] || [];

  useEffect(() => {
    if (isConnected && groupId) {
      joinGroup(groupId);
      getOnlineMembers(groupId);
    }

    return () => {
      if (groupId) {
        leaveGroup(groupId);
      }
    };
  }, [isConnected, groupId]);

  const handleSendMessage = () => {
    if (messageInput.trim() && groupId) {
      sendMessage(groupId, messageInput.trim());
      setMessageInput('');
      stopTyping(groupId);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);

    // Typing indicators
    if (value.trim()) {
      startTyping(groupId);
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set new timeout to stop typing
      const timeout = setTimeout(() => {
        stopTyping(groupId);
      }, 2000);
      
      setTypingTimeout(timeout);
    } else {
      stopTyping(groupId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="group-chat">
      <div className="chat-header">
        <h3>Group Chat</h3>
        <div className="connection-status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="online-members">
          Online: {groupOnlineMembers.length}
        </div>
      </div>

      <div className="messages-container">
        {groupMessages.map((message) => (
          <div key={message.id} className="message">
            <div className="message-header">
              <span className="sender-name">
                {message.sender.first_name} {message.sender.last_name}
              </span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {groupTypingUsers.length > 0 && (
          <div className="typing-indicator">
            {groupTypingUsers.map(user => `${user.first_name} ${user.last_name}`).join(', ')} 
            {groupTypingUsers.length === 1 ? ' is' : ' are'} typing...
          </div>
        )}
      </div>

      <div className="message-input">
        <textarea
          value={messageInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={3}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || !isConnected}
        >
          Send
        </button>
      </div>

      <div className="online-members-list">
        <h4>Online Members</h4>
        {groupOnlineMembers.map((member) => (
          <div key={member.id} className="online-member">
            {member.first_name} {member.last_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupChatComponent;
```

## Events Reference

### Client to Server Events

- `join_group`: Join a group chat room
- `leave_group`: Leave a group chat room
- `send_message`: Send a message to a group
- `typing_start`: Indicate user started typing
- `typing_stop`: Indicate user stopped typing
- `get_online_members`: Request list of online members
- `broadcast_announcement`: Send announcement (admin only)

### Server to Client Events

- `connected`: Connection successful
- `joined_group`: Successfully joined group
- `left_group`: Successfully left group
- `user_joined_group`: Another user joined the group
- `user_left_group`: Another user left the group
- `new_message`: New message received
- `user_typing_start`: User started typing
- `user_typing_stop`: User stopped typing
- `online_members`: List of online members
- `announcement`: Announcement message
- `error`: Error occurred
