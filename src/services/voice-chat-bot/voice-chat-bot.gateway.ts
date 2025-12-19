import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable, Logger } from "@nestjs/common";
import { VoiceChatBotService } from "./voice-chat-bot.service.js";

/**
 * Message payload for text chat
 */
interface ChatMessage {
  text: string;
  voice?: string;
  userId?: string;
  preferVoice: boolean;
}

/**
 * Message payload for voice/audio upload
 */
interface AudioUploadMessage {
  audioData: Buffer;
  userId?: string;
  preferVoice: boolean;
  mimeType?: string;
}

/**
 * Response payload for text messages
 */
interface MessageResponse {
  text: string;
  originalVoiceText?: string;
  timestamp: string;
}

/**
 * Response payload for voice/audio
 */
interface VoiceResponse {
  audioData: Buffer;
  timestamp: string;
}

/**
 * Error response payload
 */
interface ErrorResponse {
  message: string;
  timestamp: string;
}

/**
 * Connection acknowledgment payload
 */
interface ConnectedResponse {
  message: string;
  clientId: string;
  timestamp: string;
}

/**
 * WebSocket Gateway for Voice Chat Bot
 * 
 * Namespace: /chat-bot
 * 
 * Events:
 * - Client → Server:
 *   - 'send-message': Send text message to chat bot
 *   - 'send-voice': Send audio buffer for transcription and chat
 * 
 * - Server → Client:
 *   - 'connected': Connection acknowledgment
 *   - 'message-response': Text response from bot
 *   - 'voice-response': Audio buffer response from bot
 *   - 'error': Error messages
 */
@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/chat-bot",
})
export class VoiceChatBotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VoiceChatBotGateway.name);
  private connectedClients = new Map<string, Socket>();

  constructor(private readonly voiceChatBotService: VoiceChatBotService) {}

  // ==================== Lifecycle Hooks ====================
  
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    const response: ConnectedResponse = {
      message: "Connected to Chat Bot",
      clientId: client.id,
      timestamp: new Date().toISOString(),
    };
    
    client.emit("connected", response);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  // ==================== Message Handlers ====================

  /**
   * Handle text message from client
   * 
   * @event send-message
   * @param data - ChatMessage payload
   * @emits message-response - Text response from bot
   * @emits voice-response - Audio buffer (if preferVoice is true)
   * @emits error - Error message if processing fails
   */
  @SubscribeMessage("send-message")
  async handleMessage(
    @MessageBody() data: ChatMessage,
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Message from ${client.id}: ${data.text}`);

      // Process chat with AI
      const result = await this.voiceChatBotService.processVoiceChat(
        data.text,
        data.voice || "lauren"
      );

      // Send text response
      const messageResponse: MessageResponse = {
        text: result.textResponse,
        timestamp: new Date().toISOString(),
      };
      client.emit("message-response", messageResponse);

      // Send audio response if requested
      if (data.preferVoice && result.audioStream) {
        const voiceResponse: VoiceResponse = {
          audioData: result.audioStream,
          timestamp: new Date().toISOString(),
        };
        client.emit("voice-response", voiceResponse);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Chat error: ${error.message}`);
      this.emitError(client, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle voice/audio message from client
   * 
   * @event send-voice
   * @param data - AudioUploadMessage payload with Buffer
   * @emits message-response - Text response with original transcription
   * @emits voice-response - Audio buffer (if preferVoice is true)
   * @emits error - Error message if processing fails
   */
  @SubscribeMessage("send-voice")
  async handleVoiceMessage(
    @MessageBody() data: AudioUploadMessage,
    @ConnectedSocket() client: Socket
  ) {
    try {
      this.logger.log(`Voice message from ${client.id}`);

      // Transcribe audio to text
      const transcribedText = await this.voiceChatBotService.speechToText(
        data.audioData,
        data.mimeType || "audio/mpeg"
      );

      if (!transcribedText.trim()) {
        throw new Error("Could not transcribe audio message");
      }

      this.logger.log(`Transcribed: "${transcribedText}"`);

      // Process transcribed text with AI
      const result = await this.voiceChatBotService.processVoiceChat(
        transcribedText,
        "lauren"
      );

      // Send text response with original transcription
      const messageResponse: MessageResponse = {
        text: result.textResponse,
        originalVoiceText: transcribedText,
        timestamp: new Date().toISOString(),
      };
      client.emit("message-response", messageResponse);

      // Send audio response if requested
      if (data.preferVoice && result.audioStream) {
        const voiceResponse: VoiceResponse = {
          audioData: result.audioStream,
          timestamp: new Date().toISOString(),
        };
        client.emit("voice-response", voiceResponse);
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Voice message error: ${error.message}`);
      this.emitError(client, error.message);
      return { success: false, error: error.message };
    }
  }

  // ==================== Helper Methods ====================

  /**
   * Emit error message to client
   */
  private emitError(client: Socket, message: string) {
    const errorResponse: ErrorResponse = {
      message,
      timestamp: new Date().toISOString(),
    };
    client.emit("error", errorResponse);
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcastMessage(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Send message to specific client by socket ID
   */
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.connectedClients.get(clientId);
    if (client) {
      client.emit(event, data);
    } else {
      this.logger.warn(`Client ${clientId} not found`);
    }
  }

  /**
   * Get number of connected clients
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}
