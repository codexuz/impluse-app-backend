import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { VoiceChatBotService } from './voice-chat-bot.service.js';

interface VoiceChatMessage {
  text: string;
  voice?: string;
  userId?: string;
  sessionId?: string;
}

interface AudioUploadMessage {
  audioData: string | Buffer; // Base64 string or Buffer
  userId?: string;
  sessionId?: string;
  mimeType?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/voice-chat',
})
export class VoiceChatBotGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VoiceChatBotGateway.name);
  private connectedClients = new Map<string, Socket>();

  constructor(
    private readonly voiceChatBotService: VoiceChatBotService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    client.emit('connected', {
      message: 'Connected to Voice Chat Bot',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('text-chat')
  async handleTextChat(
    @MessageBody() data: VoiceChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Text chat from ${client.id}: ${data.text}`);
      
      // Get AI response through voice chat bot service
      const result = await this.voiceChatBotService.processVoiceChat(data.text);
      
      // Send text response immediately
      client.emit('text-response', {
        textResponse: result.textResponse,
        timestamp: new Date().toISOString(),
        clientId: client.id,
      });

      return { success: true, message: 'Text response sent' };
    } catch (error) {
      this.logger.error(`Text chat error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        type: 'text-chat-error',
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('voice-chat')
  async handleVoiceChat(
    @MessageBody() data: VoiceChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Voice chat from ${client.id}: ${data.text}`);
      
      // Process voice chat (get AI response and convert to audio)
      const result = await this.voiceChatBotService.processVoiceChat(
        data.text,
        data.voice || 'lauren'
      );

      console.log(result)
      // Send text response first
      client.emit('text-response', {
        textResponse: result.textResponse,
        timestamp: new Date().toISOString(),
        clientId: client.id,
      });

      // Convert the audio stream to binary and send it
      if (result.audioStream) {
    
          
          // Send binary audio data through WebSocket
          client.emit('audio-response', {
            hasAudio: true,
            audioData: result.audioStream,
            message: 'Audio stream ready',
            timestamp: new Date().toISOString(),
            clientId: client.id,
          });


      } else {
        // No audio stream available, just send notification
        client.emit('audio-response', {
          hasAudio: false,
          message: 'Audio generation failed',
          timestamp: new Date().toISOString(),
          clientId: client.id,
        });
      }

      return { success: true, message: 'Voice response processed' };
    } catch (error) {
      this.logger.error(`Voice chat error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        type: 'voice-chat-error',
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('text-to-voice')
  async handleTextToVoice(
    @MessageBody() data: { text: string; voice?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Text to voice from ${client.id}: ${data.text}`);
      
      const audioStream = await this.voiceChatBotService.textToVoice(
        data.text,
        data.voice || 'lauren'
      );

      if (audioStream) {
        const audioChunks: Buffer[] = [];
        
        audioStream.on('data', (chunk: Buffer) => {
          audioChunks.push(chunk);
        });

        audioStream.on('end', () => {
          const audioBuffer = Buffer.concat(audioChunks);
          
          // Send binary audio data through WebSocket
          client.emit('voice-ready', {
            success: true,
            hasAudio: true,
            audioData: audioBuffer,
            message: 'Voice conversion completed',
            timestamp: new Date().toISOString(),
          });
        });

        audioStream.on('error', (error) => {
          this.logger.error(`TTS stream error: ${error.message}`);
          client.emit('error', {
            message: `TTS stream error: ${error.message}`,
            type: 'tts-stream-error',
            timestamp: new Date().toISOString(),
          });
        });
      } else {
        client.emit('voice-ready', {
          success: false,
          hasAudio: false,
          message: 'Voice conversion failed',
          timestamp: new Date().toISOString(),
        });
      }

      return { success: true, message: 'Text converted to voice' };
    } catch (error) {
      this.logger.error(`Text to voice error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        type: 'text-to-voice-error',
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  // Utility method to send message to specific client
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  // Utility method to broadcast to all clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('speech-to-text')
  async handleSpeechToText(
    @MessageBody() data: AudioUploadMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Speech to text request from ${client.id}`);
      
      let audioBuffer: Buffer;
      
      // Convert base64 string to Buffer if needed
      if (typeof data.audioData === 'string') {
        audioBuffer = Buffer.from(data.audioData, 'base64');
      } else if (Buffer.isBuffer(data.audioData)) {
        audioBuffer = data.audioData;
      } else {
        throw new Error('Invalid audio data format');
      }
      
      // Show processing status
      client.emit('stt-processing', {
        message: 'Processing speech to text...',
        timestamp: new Date().toISOString(),
      });
      
      // Convert speech to text using Deepgram
      const transcribedText = await this.voiceChatBotService.speechToText(
        audioBuffer,
        data.mimeType || 'audio/mpeg'
      );
      
      // Send the transcribed text back to the client
      client.emit('stt-result', {
        success: true,
        text: transcribedText,
        timestamp: new Date().toISOString(),
      });

      // If the text is not empty, also process it as a voice chat request
      if (transcribedText.trim()) {
        // Process as a voice chat with the transcribed text
        this.handleVoiceChat(
          {
            text: transcribedText,
            userId: data.userId,
            sessionId: data.sessionId,
          },
          client
        );
      }
      
      return { success: true, message: 'Speech processed' };
    } catch (error) {
      this.logger.error(`Speech to text error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        type: 'speech-to-text-error',
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }
}
