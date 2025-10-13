import { Injectable, Logger } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service.js';
import { SpeechifyService } from '../speechify/speechify.service.js';
import { DeepgramService } from '../deepgram/deepgram.service.js';

@Injectable()
export class VoiceChatBotService {
    private readonly logger = new Logger(VoiceChatBotService.name);

    constructor(
        private readonly openaiService: OpenaiService,
        private readonly speechifyService: SpeechifyService,
        private readonly deepgramService: DeepgramService
    ) {}

    /**
     * Process a text message and optionally convert response to speech
     * @param text The user's text input
     * @param voice The voice ID to use (if audio response is needed)
     * @returns Object containing text response and base64 audio data
     */
    async processVoiceChat(text: string, voice: string = 'lauren'): Promise<{
        textResponse: string;
        audioStream: string; // base64 encoded audio data
    }> {
        try {
            // Get AI response from OpenAI
            const textResponse = await this.openaiService.agentBotChat(text);
            this.logger.debug(`Input: "${text}" → Response: "${textResponse}"`);
            
            // Convert the response to speech using Speechify
            const audioStream = await this.speechifyService.streamTexttoSpeech(textResponse, voice);
            
            return {
                textResponse,
                audioStream
            };
        } catch (error) {
            this.logger.error(`Error processing chat: ${error.message}`);
            throw new Error(`Chat processing error: ${error.message}`);
        }
    }
    
    /**
     * Generate a non-streaming voice response
     * @param text The text to convert to speech
     * @param voice The voice to use
     * @returns Object with text response and audio data
     */
    async generateVoiceResponse(text: string, voice: string = 'lauren'): Promise<{
        textResponse: string;
        audioData: any;
    }> {
        try {
            // Get text response from OpenAI
            const textResponse = await this.openaiService.agentBotChat(text);

            // Generate audio file using Speechify
            const audioData = await this.speechifyService.generateTexttoSpeech(textResponse, voice);
            
            return {
                textResponse,
                audioData
            };
        } catch (error) {
            this.logger.error(`Voice response generation error: ${error.message}`);
            throw new Error(`Voice response generation error: ${error.message}`);
        }
    }

    /**
     * Convert text to voice without AI processing
     * @param text The text to convert to speech
     * @param voice The voice to use
     * @returns Base64 encoded audio data
     */
    async textToVoice(text: string, voice: string = 'lauren'): Promise<string> {
        console.log(`Converting text to voice: "${text}" with voice: "${voice}"`);
        try {
            return await this.speechifyService.streamTexttoSpeech(text, voice);
        } catch (error) {
            this.logger.error(`Text to voice conversion error: ${error.message}`);
            throw new Error(`Text to voice conversion error: ${error.message}`);
        }
    }

    /**
     * Converts audio buffer to text using speech recognition
     * @param audioBuffer The audio buffer containing speech data
     * @param mimeType MIME type of the audio data
     * @returns Transcribed text from the audio
     */
    async speechToText(audioBuffer: Buffer, mimeType: string = 'audio/mpeg'): Promise<string> {
        try {
            // Use Deepgram to transcribe the audio buffer
            const transcription = await this.deepgramService.transcribeBuffer(audioBuffer, mimeType);
            
            // Extract the transcript text from the response
            const transcribedText = transcription?.results?.channels[0]?.alternatives[0]?.transcript || '';
            
            return transcribedText;
        } catch (error) {
            this.logger.error(`Speech to text error: ${error.message}`);
            throw new Error(`Speech to text error: ${error.message}`);
        }
    }
}
