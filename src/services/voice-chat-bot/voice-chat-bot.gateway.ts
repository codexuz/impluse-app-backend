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
        data.voice || 'lisa'
      );

      if (audioStream) {
    
          
          // Send binary audio data through WebSocket
          client.emit('voice-ready', {
            success: true,
            hasAudio: true,
            audioData: audioStream,
            message: 'Voice conversion completed',
            timestamp: new Date().toISOString(),
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
}
