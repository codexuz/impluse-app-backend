# Voice Chat Bot Service

A voice-enabled chat bot that combines OpenAI's conversational AI with Speechify's text-to-speech capabilities.

## Features

- **Text-based chat** with OpenAI's English teacher agent
- **Voice responses** using Speechify's text-to-speech engine
- **Streaming audio** for real-time voice interactions
- **Multiple voice options** (default: 'lauren')

## API Endpoints

### 1. Voice Chat (Text Response Only)
```http
POST /voice-chat-bot/chat
Content-Type: application/json

{
  "text": "Hello, I want to practice English",
  "voice": "lauren"  // optional
}
```

**Response:**
```json
{
  "textResponse": "Hello! I'm happy to help you practice English...",
  "hasAudio": true,
  "message": "Use /voice-chat-bot/chat-stream for audio stream"
}
```

### 2. Voice Chat with Audio Stream
```http
POST /voice-chat-bot/chat-stream
Content-Type: application/json

{
  "text": "How can I improve my pronunciation?",
  "voice": "lauren"  // optional
}
```

**Response:** Audio stream (audio/mpeg)

### 3. Generate Voice Response (Non-streaming)
```http
POST /voice-chat-bot/generate-audio
Content-Type: application/json

{
  "text": "What's the difference between 'affect' and 'effect'?",
  "voice": "lauren"  // optional
}
```

**Response:**
```json
{
  "textResponse": "Great question! 'Affect' is usually a verb...",
  "audioData": "...audio data..."
}
```

### 4. Text to Voice (Direct Conversion)
```http
POST /voice-chat-bot/text-to-voice
Content-Type: application/json

{
  "text": "This is a test message",
  "voice": "lauren"  // optional
}
```

**Response:** Audio stream (audio/mpeg)

## Available Voices

- `lauren` (default)
- `alex`
- `sarah`
- And more (check Speechify documentation)

## Usage Examples

### Frontend Integration (JavaScript)

```javascript
// Text chat
const response = await fetch('/voice-chat-bot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: 'Help me with grammar',
    voice: 'lauren'
  })
});

// Audio stream
const audioResponse = await fetch('/voice-chat-bot/chat-stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: 'Help me with grammar',
    voice: 'lauren'
  })
});

// Play audio
const audioBlob = await audioResponse.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

## Configuration

Make sure you have the following environment variables:
- `openAiKey` - Your OpenAI API key
- `speechifyToken` - Your Speechify API token

## Dependencies

- OpenAI Service (for chat responses)
- Speechify Service (for text-to-speech conversion)
