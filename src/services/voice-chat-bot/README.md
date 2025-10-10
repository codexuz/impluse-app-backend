# Chat Bot Application Guide

This document explains how to use the chat bot application in both text and voice modes.

## Overview

The chat bot provides interactive communication through both WebSocket (real-time) and REST API interfaces. It supports:

- Text-based messaging
- Voice-based messaging (speech-to-text)
- AI-generated text responses
- AI-generated voice responses (text-to-speech)

## WebSocket Interface

The WebSocket interface is ideal for real-time chat applications where immediate responses are required.

### Connection

Connect to the WebSocket server at:

```javascript
const socket = io('http://your-server-url/chat-bot');

// Listen for connection confirmation
socket.on('connected', (data) => {
  console.log('Connected to chat bot:', data);
  // data contains: { message, clientId, timestamp }
});
```

### Sending Messages

#### Text Messages

```javascript
// Send a text message
socket.emit('send-message', {
  text: "Hello, can you help me with my English grammar?",
  preferVoice: true,  // Set to true if you want voice responses
  voice: "lauren"     // Optional: Specify voice type (default: "lauren")
});
```

#### Voice Messages

```javascript
// Record audio from microphone (example using browser API)
const recordAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.start();
  
  // Stop recording after 5 seconds (example)
  setTimeout(() => {
    mediaRecorder.stop();
  }, 5000);

  return new Promise(resolve => {
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
      resolve(audioBlob);
    });
  });
};

// Send recorded audio
const sendVoiceMessage = async (preferVoiceResponse = true) => {
  const audioBlob = await recordAudio();
  
  // Convert blob to base64
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  reader.onloadend = () => {
    const base64Audio = reader.result.split(',')[1]; // Remove data URL prefix
    
    socket.emit('send-voice', {
      audioData: base64Audio,
      preferVoice: preferVoiceResponse,
      mimeType: audioBlob.type
    });
  };
};
```

### Receiving Responses

#### Text Responses

```javascript
// Listen for text responses
socket.on('message-response', (data) => {
  console.log('Bot response:', data.text);
  
  // If the message was from voice input, you can get the transcription
  if (data.originalVoiceText) {
    console.log('Your voice was transcribed as:', data.originalVoiceText);
  }
  
  // Display the response in your UI
  displayMessage(data.text, 'bot', data.timestamp);
});
```

#### Voice Responses

```javascript
// Listen for voice responses (only received if preferVoice was true)
socket.on('voice-response', (data) => {
  // Convert the audio data to playable format
  const audioBlob = new Blob([data.audioData], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(audioBlob);
  
  // Play the audio
  const audio = new Audio(audioUrl);
  audio.play();
});
```

#### Error Handling

```javascript
// Handle errors
socket.on('error', (data) => {
  console.error('Chat bot error:', data.message);
  
  // Show error message to user
  displayError(data.message);
});
```

## REST API Interface

For applications that prefer HTTP-based communication, the following endpoints are available:

### Text Chat

```
POST /voice-chat-bot/chat
```

Request body:
```json
{
  "text": "Hello, how are you?",
  "voice": "lauren" // Optional
}
```

Response:
```json
{
  "textResponse": "I'm doing well, thank you for asking! How can I assist you today?",
  "hasAudio": true,
  "message": "Use /voice-chat-bot/chat-stream for audio stream"
}
```

### Audio Stream

```
POST /voice-chat-bot/chat-stream
```

Request body (same as above):
```json
{
  "text": "Hello, how are you?",
  "voice": "lauren" // Optional
}
```

Response: Audio stream (Content-Type: audio/mpeg)

### Text to Voice Conversion

```
POST /voice-chat-bot/text-to-voice
```

Request body:
```json
{
  "text": "Convert this text to speech",
  "voice": "lauren" // Optional
}
```

Response: Audio stream (Content-Type: audio/mpeg)

## Frontend Integration Examples

### React Example

```jsx
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [preferVoice, setPreferVoice] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Connect to socket
  useEffect(() => {
    socketRef.current = io('http://your-server-url/chat-bot');
    
    socketRef.current.on('connected', (data) => {
      console.log('Connected to chat bot:', data);
      setIsConnected(true);
    });
    
    socketRef.current.on('message-response', (data) => {
      setMessages(prev => [...prev, { 
        text: data.text, 
        sender: 'bot', 
        timestamp: data.timestamp 
      }]);
    });
    
    socketRef.current.on('voice-response', (data) => {
      const audioBlob = new Blob([data.audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });
    
    socketRef.current.on('error', (data) => {
      console.error('Error:', data.message);
    });
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Send text message
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    socketRef.current.emit('send-message', {
      text: inputMessage,
      preferVoice
    });
    
    setMessages(prev => [...prev, { 
      text: inputMessage, 
      sender: 'user', 
      timestamp: new Date().toISOString() 
    }]);
    
    setInputMessage('');
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      });
      
      setIsRecording(true);
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const sendVoiceMessage = (audioBlob) => {
    setMessages(prev => [...prev, { 
      text: "🎤 Voice message sent", 
      sender: 'user', 
      timestamp: new Date().toISOString() 
    }]);
    
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      
      socketRef.current.emit('send-voice', {
        audioData: base64Audio,
        preferVoice,
        mimeType: 'audio/mpeg'
      });
    };
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Chat Bot</h2>
        <div className="status">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="voice-preference">
          <label>
            <input 
              type="checkbox" 
              checked={preferVoice} 
              onChange={() => setPreferVoice(!preferVoice)} 
            />
            Voice Responses
          </label>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">{msg.text}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button 
          className={isRecording ? 'recording' : ''}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
        >
          {isRecording ? 'Recording...' : '🎤'}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
```

## Configuration Options

### Voice Options

The following voices are available:

- "lauren" (default) - Female US English
- "daniel" - Male US English
- "sarah" - Female British English
- "jackson" - Male US English

### Response Preferences

You can control whether you want voice responses by setting the `preferVoice` parameter:

- `preferVoice: true` - Get both text and audio responses
- `preferVoice: false` - Get only text responses (default)

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the WebSocket:

1. Ensure the server is running
2. Check that you're using the correct URL and namespace
3. Verify that CORS is properly configured for your client domain

### Audio Issues

If audio responses aren't working:

1. Ensure your browser supports the Audio API
2. Check that audio is not muted
3. Verify that `preferVoice` is set to `true`

### Voice Recording Issues

If voice recording isn't working:

1. Ensure you've granted microphone permissions
2. Check that your browser supports `MediaRecorder`
3. Try using a different microphone

## Performance Considerations

- Voice responses may take longer than text responses due to audio processing
- Large audio files may impact performance; try to keep voice recordings short
- For mobile devices, consider the impact on battery and data usage

---

For further assistance or feature requests, please contact the development team.