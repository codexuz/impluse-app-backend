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

interface ChatMessage {
  text: string;
  voice?: string;
  userId?: string;
  preferVoice: boolean; // User preference for receiving voice responses
}

interface AudioUploadMessage {
  audioData: string | Buffer; // Base64 string or Buffer
  userId?: string;
  preferVoice: boolean;
  mimeType?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat-bot',
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
      message: 'Connected to Chat Bot',
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() data: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Message from ${client.id}: ${data.text}`);
      
      // Get AI response
      const result = await this.voiceChatBotService.processVoiceChat(
        data.text,
        data.voice || 'lauren'
      );
      
      // Always send text response
      client.emit('message-response', {
        text: result.textResponse,
        timestamp: new Date().toISOString(),
      });

      // Send audio only if user prefers voice responses
      if (data.preferVoice && result.audioStream) {
        client.emit('voice-response', {
          audioData: result.audioStream,
          timestamp: new Date().toISOString(),
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Chat error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('send-voice')
  async handleVoiceMessage(
    @MessageBody() data: AudioUploadMessage,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Voice message from ${client.id}`);
      
      let audioBuffer: Buffer;
      
      // Convert base64 string to Buffer if needed
      if (typeof data.audioData === 'string') {
        audioBuffer = Buffer.from(data.audioData, 'base64');
      } else if (Buffer.isBuffer(data.audioData)) {
        audioBuffer = data.audioData;
      } else {
        throw new Error('Invalid audio data format');
      }
      
      // Convert speech to text
      const transcribedText = await this.voiceChatBotService.speechToText(
        audioBuffer,
        data.mimeType || 'audio/mpeg'
      );
      
      if (!transcribedText.trim()) {
        throw new Error('Could not transcribe audio message');
      }
      
      // Process the transcribed text as a regular message
      const result = await this.voiceChatBotService.processVoiceChat(
        transcribedText,
        'lauren'
      );
      
      // Send text response
      client.emit('message-response', {
        text: result.textResponse,
        originalVoiceText: transcribedText,
        timestamp: new Date().toISOString(),
      });
      
      // Send audio response if user prefers voice
      if (data.preferVoice && result.audioStream) {
        client.emit('voice-response', {
          audioData: result.audioStream,
          timestamp: new Date().toISOString(),
        });
      }
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Voice message error: ${error.message}`);
      client.emit('error', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }
}
