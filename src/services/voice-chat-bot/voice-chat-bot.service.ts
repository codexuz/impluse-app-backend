import { Injectable } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service.js';
import { SpeechifyService } from '../speechify/speechify.service.js';
import { DeepgramService } from '../deepgram/deepgram.service.js';

@Injectable()
export class VoiceChatBotService {
    constructor(
        private readonly openaiService: OpenaiService,
        private readonly speechifyService: SpeechifyService,
        private readonly deepgramService: DeepgramService
    ) {}

    async processVoiceChat(text: string, voice: string = 'lauren'): Promise<{
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

    async generateVoiceResponse(text: string, voice: string = 'lauren'): Promise<{
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

    async textToVoice(text: string, voice: string = 'lauren'): Promise<any> {
        try {
            return await this.speechifyService.streamTexttoSpeech(text, voice);
        } catch (error) {
            throw new Error(`Text to voice conversion error: ${error.message}`);
        }
    }

    /**
     * Converts audio buffer to text using speech recognition
     * @param audioBuffer The audio buffer containing speech data
     * @param mimeType MIME type of the audio data (default: audio/mpeg)
     * @returns Transcribed text from the audio
     */
    async speechToText(audioBuffer: Buffer, mimeType: string = 'audio/mpeg'): Promise<string> {
        try {
            // Use Deepgram to transcribe the audio buffer
            const transcription = await this.deepgramService.transcribeBuffer(audioBuffer, mimeType);
            
            // Extract the transcript text from the Deepgram response
            const transcribedText = transcription?.results?.channels[0]?.alternatives[0]?.transcript || '';
            
            return transcribedText;
        } catch (error) {
            throw new Error(`Speech to text conversion error: ${error.message}`);
        }
    }
}
