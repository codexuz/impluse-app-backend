# Voice Chat Bot WebSocket Gateway - Usage Guide

## Overview
The Voice Chat Bot Gateway provides real-time bidirectional communication for text and voice interactions with an AI chatbot. Audio data is transmitted as **binary buffers** for optimal performance.

## Connection Details

### Endpoint
```
ws://localhost:3000/chat-bot
```

### Namespace
```
/chat-bot
```

---

## Events Reference

### Client → Server Events

#### 1. `send-message` - Send Text Message

Send a text message to the chatbot and optionally receive audio response.

**Payload:**
```typescript
{
  text: string;           // The message to send
  voice?: string;         // Voice ID (optional, default: 'lauren')
  userId?: string;        // User identifier (optional)
  preferVoice: boolean;   // Whether to receive audio response
}
```

**Example:**
```javascript
socket.emit('send-message', {
  text: 'Hello, how are you?',
  voice: 'lauren',
  preferVoice: true
});
```

---

#### 2. `send-voice` - Send Audio Message

Upload audio buffer for transcription and AI processing.

**Payload:**
```typescript
{
  audioData: Buffer;      // Audio data as Buffer
  userId?: string;        // User identifier (optional)
  preferVoice: boolean;   // Whether to receive audio response
  mimeType?: string;      // Audio MIME type (default: 'audio/mpeg')
}
```

**Example:**
```javascript
// Assuming you have audio data as ArrayBuffer
const audioBuffer = Buffer.from(audioArrayBuffer);

socket.emit('send-voice', {
  audioData: audioBuffer,
  preferVoice: true,
  mimeType: 'audio/mpeg'
});
```

---

### Server → Client Events

#### 1. `connected` - Connection Acknowledgment

Sent immediately after successful connection.

**Payload:**
```typescript
{
  message: string;      // Welcome message
  clientId: string;     // Your socket ID
  timestamp: string;    // ISO timestamp
}
```

**Example Response:**
```json
{
  "message": "Connected to Chat Bot",
  "clientId": "abc123xyz",
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

---

#### 2. `message-response` - Text Response

Receive text response from the chatbot.

**Payload:**
```typescript
{
  text: string;              // Bot's text response
  originalVoiceText?: string; // Original transcription (if from voice)
  timestamp: string;          // ISO timestamp
}
```

**Example Response:**
```json
{
  "text": "Hello! I'm doing great, thank you for asking!",
  "timestamp": "2025-12-18T10:30:01.500Z"
}
```

---

#### 3. `voice-response` - Audio Response

Receive audio response from the chatbot (only if `preferVoice: true`).

**Payload:**
```typescript
{
  audioData: Buffer;    // Audio data as Buffer
  timestamp: string;    // ISO timestamp
}
```

**Example Handling:**
```javascript
socket.on('voice-response', (data) => {
  const audioBlob = new Blob([data.audioData], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  
  const audio = new Audio(audioUrl);
  audio.play();
});
```

---

#### 4. `error` - Error Message

Receive error notifications.

**Payload:**
```typescript
{
  message: string;      // Error description
  timestamp: string;    // ISO timestamp
}
```

**Example Response:**
```json
{
  "message": "Could not transcribe audio message",
  "timestamp": "2025-12-18T10:30:02.000Z"
}
```

---

## Complete Usage Examples

### Example 1: Node.js Client (with Buffer)

```javascript
import { io } from 'socket.io-client';
import fs from 'fs';

// Connect to gateway
const socket = io('ws://localhost:3000/chat-bot', {
  transports: ['websocket']
});

// Handle connection
socket.on('connected', (data) => {
  console.log('Connected:', data.message);
  console.log('Client ID:', data.clientId);
  
  // Send text message
  socket.emit('send-message', {
    text: 'What is the weather like today?',
    voice: 'lauren',
    preferVoice: true
  });
});

// Handle text responses
socket.on('message-response', (data) => {
  console.log('Bot says:', data.text);
  if (data.originalVoiceText) {
    console.log('You said:', data.originalVoiceText);
  }
});

// Handle audio responses
socket.on('voice-response', (data) => {
  console.log('Received audio response');
  fs.writeFileSync('response.mp3', data.audioData);
  console.log('Audio saved to response.mp3');
});

// Handle errors
socket.on('error', (data) => {
  console.error('Error:', data.message);
});

// Send audio file
setTimeout(() => {
  const audioBuffer = fs.readFileSync('input.mp3');
  
  socket.emit('send-voice', {
    audioData: audioBuffer,
    preferVoice: true,
    mimeType: 'audio/mpeg'
  });
}, 2000);
```

---

### Example 2: Browser Client (with ArrayBuffer)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Voice Chat Bot Client</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Voice Chat Bot</h1>
  
  <div>
    <input type="text" id="messageInput" placeholder="Type your message...">
    <label>
      <input type="checkbox" id="preferVoice"> Receive voice response
    </label>
    <button onclick="sendMessage()">Send</button>
  </div>
  
  <div>
    <button onclick="startRecording()">🎤 Record</button>
    <button onclick="stopRecording()">⏹️ Stop</button>
  </div>
  
  <div id="messages"></div>
  <audio id="audioPlayer" controls></audio>

  <script>
    const socket = io('ws://localhost:3000/chat-bot', {
      transports: ['websocket']
    });

    let mediaRecorder;
    let audioChunks = [];

    // Connection handler
    socket.on('connected', (data) => {
      addMessage('System', `Connected: ${data.message}`);
      console.log('Client ID:', data.clientId);
    });

    // Message response handler
    socket.on('message-response', (data) => {
      addMessage('Bot', data.text);
      if (data.originalVoiceText) {
        addMessage('You', `(Voice: ${data.originalVoiceText})`);
      }
    });

    // Voice response handler
    socket.on('voice-response', (data) => {
      const audioBlob = new Blob([data.audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audioPlayer = document.getElementById('audioPlayer');
      audioPlayer.src = audioUrl;
      audioPlayer.play();
    });

    // Error handler
    socket.on('error', (data) => {
      addMessage('Error', data.message);
    });

    // Send text message
    function sendMessage() {
      const input = document.getElementById('messageInput');
      const preferVoice = document.getElementById('preferVoice').checked;
      
      if (input.value.trim()) {
        socket.emit('send-message', {
          text: input.value,
          voice: 'lauren',
          preferVoice: preferVoice
        });
        
        addMessage('You', input.value);
        input.value = '';
      }
    }

    // Start audio recording
    async function startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const preferVoice = document.getElementById('preferVoice').checked;
          
          socket.emit('send-voice', {
            audioData: buffer,
            preferVoice: preferVoice,
            mimeType: 'audio/mpeg'
          });
          
          addMessage('System', 'Voice message sent');
        };

        mediaRecorder.start();
        addMessage('System', 'Recording...');
      } catch (error) {
        addMessage('Error', `Could not access microphone: ${error.message}`);
      }
    }

    // Stop audio recording
    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        addMessage('System', 'Recording stopped');
      }
    }

    // Add message to UI
    function addMessage(sender, text) {
      const messagesDiv = document.getElementById('messages');
      const messageEl = document.createElement('div');
      messageEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
      messagesDiv.appendChild(messageEl);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Send message on Enter key
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  </script>
</body>
</html>
```

---

### Example 3: React Client

```javascript
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const VoiceChatBot = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [preferVoice, setPreferVoice] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('ws://localhost:3000/chat-bot', {
      transports: ['websocket']
    });

    // Connection handler
    newSocket.on('connected', (data) => {
      console.log('Connected:', data);
      addMessage('system', `Connected: ${data.message}`);
    });

    // Message response handler
    newSocket.on('message-response', (data) => {
      addMessage('bot', data.text);
      if (data.originalVoiceText) {
        addMessage('transcription', `You said: "${data.originalVoiceText}"`);
      }
    });

    // Voice response handler
    newSocket.on('voice-response', (data) => {
      const audioBlob = new Blob([data.audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play();
      }
    });

    // Error handler
    newSocket.on('error', (data) => {
      addMessage('error', data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, { type, text, timestamp: new Date() }]);
  };

  const sendMessage = () => {
    if (socket && inputText.trim()) {
      socket.emit('send-message', {
        text: inputText,
        voice: 'lauren',
        preferVoice: preferVoice
      });
      
      addMessage('user', inputText);
      setInputText('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        socket.emit('send-voice', {
          audioData: buffer,
          preferVoice: preferVoice,
          mimeType: 'audio/mpeg'
        });
        
        addMessage('system', 'Voice message sent');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      addMessage('system', 'Recording started...');
    } catch (error) {
      addMessage('error', `Microphone error: ${error.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      addMessage('system', 'Recording stopped');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Voice Chat Bot</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          style={{ width: '60%', padding: '10px', marginRight: '10px' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
          Send
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={preferVoice}
            onChange={(e) => setPreferVoice(e.target.checked)}
          />
          Receive voice responses
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={startRecording} 
          disabled={isRecording}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          🎤 Start Recording
        </button>
        <button 
          onClick={stopRecording} 
          disabled={!isRecording}
          style={{ padding: '10px 20px' }}
        >
          ⏹️ Stop Recording
        </button>
      </div>

      <div style={{ 
        border: '1px solid #ccc', 
        padding: '10px', 
        height: '400px', 
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            marginBottom: '10px',
            padding: '5px',
            backgroundColor: msg.type === 'user' ? '#e3f2fd' : 
                           msg.type === 'bot' ? '#f1f8e9' : 
                           msg.type === 'error' ? '#ffebee' : '#f5f5f5'
          }}>
            <strong>{msg.type}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <audio ref={audioPlayerRef} controls style={{ width: '100%' }} />
    </div>
  );
};

export default VoiceChatBot;
```

---

## Audio Format Requirements

### Supported Formats
- **MP3** (audio/mpeg) - Recommended
- **WAV** (audio/wav)
- **WebM** (audio/webm)
- **OGG** (audio/ogg)

### Recommendations
- Use MP3 format for best compatibility
- Sample rate: 16000-48000 Hz
- Channels: Mono or Stereo
- Bitrate: 64-128 kbps

---

## Best Practices

1. **Error Handling**: Always listen for the `error` event
2. **Connection Management**: Handle reconnection logic for production
3. **Audio Quality**: Use appropriate encoding for your use case
4. **Memory Management**: Clean up audio URLs with `URL.revokeObjectURL()`
5. **User Feedback**: Provide visual feedback during recording/processing
6. **Timeout**: Implement timeouts for long-running operations

---

## Troubleshooting

### Connection Issues
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error);
});
```

### Audio Not Playing
- Check MIME type compatibility
- Verify audio data is valid Buffer
- Check browser console for errors

### Transcription Fails
- Ensure audio contains clear speech
- Check audio format is supported
- Verify audio buffer is not empty

---

## Security Considerations

1. **Authentication**: Implement user authentication before allowing connections
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Validate all incoming data
4. **CORS**: Configure CORS properly for production
5. **SSL/TLS**: Use WSS (secure WebSocket) in production

---

## Performance Tips

1. **Buffer Pooling**: Reuse buffers when possible
2. **Compression**: Use audio compression for large files
3. **Chunking**: For large audio files, consider streaming in chunks
4. **Caching**: Cache frequently used voice responses
5. **Connection Pooling**: Manage connection limits appropriately

---

## Need Help?

For additional support or questions, please refer to:
- API Documentation: `/api/docs`
- WebSocket Usage: `WEBSOCKET_USAGE.md`
- Service README: `README.md`
