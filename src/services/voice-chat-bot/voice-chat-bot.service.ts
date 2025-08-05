import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service.js';
import { SpeechifyService } from '../speechify/speechify.service.js';

@Injectable()
export class VoiceChatBotService {
    constructor(
        private readonly openaiService: OpenaiService,
        private readonly speechifyService: SpeechifyService
    ) {}

    async processVoiceChat(text: string, voice: string = 'lisa'): Promise<{
        textResponse: string;
        audioStream: any;
    }> {
        try {
            // Get text response from OpenAI using the actual input text
            const textResponse = await this.openaiService.agentBotChat(text);
            console.log('Input:', text, 'Response:', textResponse);
            
            // Convert the response to speech using Speechify
            const audioStream = await this.speechifyService.streamTexttoSpeech(textResponse, voice);
            
            return {
                textResponse,
                audioStream: audioStream // Convert to base64 for easier transport
            };
        } catch (error) {
            throw new Error(`Voice chat bot error: ${error.message}`);
        }
    }

    async generateVoiceResponse(text: string, voice: string = 'lisa'): Promise<{
        textResponse: string;
        audioData: any;
    }> {
        try {
            // Get text response from OpenAI using the actual input text
            const textResponse = await this.openaiService.agentBotChat(text);

            // Generate audio file using Speechify
            const audioData = await this.speechifyService.generateTexttoSpeech(textResponse, voice);
            
            return {
                textResponse,
                audioData
            };
        } catch (error) {
            throw new Error(`Voice response generation error: ${error.message}`);
        }
    }

    async textToVoice(text: string, voice: string = 'lisa'): Promise<any> {
        try {
            return await this.speechifyService.streamTexttoSpeech(text, voice);
        } catch (error) {
            throw new Error(`Text to voice conversion error: ${error.message}`);
        }
    }
}
