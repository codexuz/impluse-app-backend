# WebSocket Voice Chat Bot - Client Example

## Frontend Integration (JavaScript/TypeScript)

### Setup Socket.IO Client

```bash
npm install socket.io-client
```

### Basic WebSocket Connection

```javascript
import { io } from 'socket.io-client';

// Connect to the voice chat WebSocket
const socket = io('http://localhost:3000/voice-chat', {
  transports: ['websocket']
});

// Connection events
socket.on('connected', (data) => {
  console.log('Connected to Voice Chat Bot:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Voice Chat Bot');
});

socket.on('error', (error) => {
  console.error('WebSocket Error:', error);
});
```

### Text Chat (Fast Response)

```javascript
// Send text message and get immediate AI response
function sendTextMessage(message) {
  socket.emit('text-chat', {
    text: message,
    userId: 'user123',
    sessionId: 'session456'
  });
}

// Listen for text responses
socket.on('text-response', (data) => {
  console.log('AI Response:', data.textResponse);
  displayMessage(data.textResponse);
});

// Example usage
sendTextMessage("Hello, can you help me practice English?");
```

### Voice Chat (Text + Audio)

```javascript
// Send text and get both text and audio response
function sendVoiceMessage(message, voice = 'lauren') {
  socket.emit('voice-chat', {
    text: message,
    voice: voice,
    userId: 'user123'
  });
}

// Listen for responses
socket.on('text-response', (data) => {
  console.log('Text Response:', data.textResponse);
  displayMessage(data.textResponse);
});

socket.on('audio-response', (data) => {
  console.log('Audio Response Ready:', data.message);
  // You can request the audio stream via HTTP endpoint
  fetchAudioStream(data.textResponse);
});

// Example usage
sendVoiceMessage("How do I improve my pronunciation?", "lauren");
```

### Text-to-Voice Conversion

```javascript
// Convert any text to voice
function convertTextToVoice(text, voice = 'lauren') {
  socket.emit('text-to-voice', {
    text: text,
    voice: voice
  });
}

socket.on('voice-ready', (data) => {
  console.log('Voice conversion completed:', data);
  // You can request the audio via HTTP endpoint
});

// Example usage
convertTextToVoice("This is a test message", "lauren");
```

### Complete React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const VoiceChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000/voice-chat');
    
    newSocket.on('connected', (data) => {
      setIsConnected(true);
      console.log('Connected:', data);
    });

    newSocket.on('text-response', (data) => {
      setMessages(prev => [...prev, {
        type: 'ai',
        text: data.textResponse,
        timestamp: data.timestamp
      }]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket && inputText.trim()) {
      // Add user message to chat
      setMessages(prev => [...prev, {
        type: 'user',
        text: inputText,
        timestamp: new Date().toISOString()
      }]);

      // Send to AI via WebSocket
      socket.emit('text-chat', {
        text: inputText,
        userId: 'user123'
      });

      setInputText('');
    }
  };

  const sendVoiceMessage = () => {
    if (socket && inputText.trim()) {
      setMessages(prev => [...prev, {
        type: 'user',
        text: inputText,
        timestamp: new Date().toISOString()
      }]);

      socket.emit('voice-chat', {
        text: inputText,
        voice: 'lauren',
        userId: 'user123'
      });

      setInputText('');
    }
  };

  return (
    <div className="voice-chat-bot">
      <div className="status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <strong>{message.type === 'user' ? 'You' : 'AI Teacher'}:</strong>
            <p>{message.text}</p>
            <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send Text</button>
        <button onClick={sendVoiceMessage}>Send Voice</button>
      </div>
    </div>
  );
};

export default VoiceChatBot;
```

## WebSocket Events Summary

### Client → Server Events:
- `text-chat` - Send text message for AI response
- `voice-chat` - Send text message for AI response + audio
- `text-to-voice` - Convert text to voice

### Server → Client Events:
- `connected` - Connection established
- `text-response` - AI text response
- `audio-response` - Audio response ready
- `voice-ready` - Voice conversion completed
- `error` - Error occurred

## Benefits of WebSocket Implementation

✅ **Real-time Communication**: Instant message exchange
✅ **Low Latency**: Faster than HTTP requests
✅ **Bidirectional**: Server can push updates to client
✅ **Connection Persistence**: Maintains connection state
✅ **Multiple Chat Types**: Text, voice, and realtime audio
✅ **Session Management**: Individual client sessions
✅ **Error Handling**: Comprehensive error reporting
