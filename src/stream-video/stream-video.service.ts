import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamClient } from '@stream-io/node-sdk';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserCallDto, CreateAiCallDto } from './dto/stream-video.dto.js';

const AI_AGENT_USER_ID = 'ai-agent';
const CALL_TYPE = 'default';

// Holds live RealtimeClient instances keyed by callId
const activeAgents = new Map<string, any>();

@Injectable()
export class StreamVideoService implements OnModuleInit {
  private readonly logger = new Logger(StreamVideoService.name);
  private client: StreamClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('STREAM_API_KEY');
    const apiSecret = this.configService.get<string>('STREAM_API_SECRET');

    if (!apiKey || !apiSecret) {
      this.logger.warn('STREAM_API_KEY or STREAM_API_SECRET not set — Stream Video disabled');
      return;
    }

    this.client = new StreamClient(apiKey, apiSecret);
    this.logger.log('Stream Video client initialized');
  }

  private ensureClient() {
    if (!this.client) {
      throw new BadRequestException(
        'Stream Video is not configured. Set STREAM_API_KEY and STREAM_API_SECRET.',
      );
    }
  }

  async generateUserToken(userId: string) {
    this.ensureClient();

    await this.client.upsertUsers([{ id: userId }]);

    const token = this.client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 24,
    });

    return {
      token,
      user_id: userId,
      api_key: this.configService.get<string>('STREAM_API_KEY'),
    };
  }

  async createUserToUserCall(callerId: string, dto: CreateUserCallDto) {
    this.ensureClient();

    const callId = dto.call_id ?? uuidv4();

    await this.client.upsertUsers([
      { id: callerId },
      { id: dto.target_user_id },
    ]);

    const call = this.client.video.call(CALL_TYPE, callId);

    await call.create({
      data: {
        created_by_id: callerId,
        members: [
          { user_id: callerId, role: 'admin' },
          { user_id: dto.target_user_id },
        ],
        settings_override: {
          audio: { default_device: 'earpiece', noise_cancellation: { mode: 'disabled' } },
        },
      },
    });

    // Generate token for the caller so the frontend can join
    const callerToken = this.client.generateUserToken({
      user_id: callerId,
      validity_in_seconds: 60 * 60 * 24,
    });

    return {
      call_id: callId,
      call_type: CALL_TYPE,
      api_key: this.configService.get<string>('STREAM_API_KEY'),
      caller_id: callerId,
      caller_token: callerToken,
      target_user_id: dto.target_user_id,
    };
  }

  async createAiAgentCall(userId: string, dto: CreateAiCallDto) {
    this.ensureClient();

    const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new BadRequestException('OPENAI_API_KEY is not configured.');
    }

    const callId = dto.call_id ?? uuidv4();
    const systemPrompt =
      dto.system_prompt ?? 'You are a helpful English language tutor. Speak clearly and encourage the student.';

    // Upsert both the human and the AI bot user
    await this.client.upsertUsers([
      { id: userId },
      { id: AI_AGENT_USER_ID, name: 'AI Tutor', role: 'user' },
    ]);

    // Create the call with both members
    const call = this.client.video.call(CALL_TYPE, callId);
    await call.create({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: 'admin' },
          { user_id: AI_AGENT_USER_ID },
        ],
        custom: { ai_agent: true, system_prompt: systemPrompt },
        settings_override: {
          audio: { default_device: 'earpiece', noise_cancellation: { mode: 'disabled' } },
        },
      },
    });

    this.logger.log(`Connecting OpenAI Realtime agent for call ${callId}`);
    this.logger.log(`OpenAI key prefix: ${openAiKey.slice(0, 10)}...`);

    let realtimeClient: any;
    try {
      realtimeClient = await this.client.video.connectOpenAi({
        call,
        agentUserId: AI_AGENT_USER_ID,
        openAiApiKey: openAiKey,
        model: 'gpt-realtime-1.5',
      });
    } catch (err) {
      this.logger.error('connectOpenAi failed:', JSON.stringify(err, null, 2));
      throw err;
    }

    // Configure the agent session
    realtimeClient.updateSession({
      voice: 'alloy',
      instructions: systemPrompt,
    });

    // Auto-disconnect the agent when the call ends
    realtimeClient.on('call.session_ended', () => {
      this.logger.log(`Call ${callId} session ended — disconnecting agent`);
      activeAgents.delete(callId);
    });

    realtimeClient.on('call.ended', () => {
      this.logger.log(`Call ${callId} ended — disconnecting agent`);
      activeAgents.delete(callId);
    });

    // Store the live agent so we can disconnect it later
    activeAgents.set(callId, realtimeClient);

    // Generate a user token for the frontend to join
    const userToken = this.client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 24,
    });

    return {
      call_id: callId,
      call_type: CALL_TYPE,
      api_key: this.configService.get<string>('STREAM_API_KEY'),
      user_id: userId,
      user_token: userToken,
    };
  }

  async endCall(callId: string) {
    this.ensureClient();

    // Disconnect any live AI agent on this call
    const agent = activeAgents.get(callId);
    if (agent) {
      try {
        agent.disconnect?.();
      } catch {
        // ignore disconnect errors
      }
      activeAgents.delete(callId);
    }

    const call = this.client.video.call(CALL_TYPE, callId);
    await call.end();
    return { call_id: callId, status: 'ended' };
  }

  async getCallInfo(callId: string) {
    this.ensureClient();
    const call = this.client.video.call(CALL_TYPE, callId);
    const response = await call.get();
    return response.call;
  }
}
