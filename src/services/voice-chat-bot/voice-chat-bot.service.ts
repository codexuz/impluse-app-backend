import { Injectable, Logger } from "@nestjs/common";
import { OpenaiService } from "../openai/openai.service.js";
import { SpeechifyService } from "../speechify/speechify.service.js";
import { DeepgramService } from "../deepgram/deepgram.service.js";
import { AwsStorageService } from "../../aws-storage/aws-storage.service.js";

@Injectable()
export class VoiceChatBotService {
  private readonly logger = new Logger(VoiceChatBotService.name);
  private readonly bucketName = "impulse-voice-audio";

  constructor(
    private readonly openaiService: OpenaiService,
    private readonly speechifyService: SpeechifyService,
    private readonly deepgramService: DeepgramService,
    private readonly awsStorageService: AwsStorageService,
  ) {}

  /**
   * Process a text message and optionally convert response to speech
   * @param text The user's text input
   * @param voice The voice ID to use (if audio response is needed)
   * @returns Object containing text response and audio buffer
   */
  async processVoiceChat(
    text: string,
    voice: string = "lauren",
  ): Promise<{
    textResponse: string;
    audioStream: Buffer; // audio buffer
  }> {
    try {
      // Get AI response from OpenAI
      const textResponse = await this.openaiService.agentBotChat(text);
      this.logger.debug(`Input: "${text}" → Response: "${textResponse}"`);

      // Convert the response to speech using Speechify
      const audioStream = await this.speechifyService.streamTexttoSpeech(
        textResponse,
        voice,
      );

      return {
        textResponse,
        audioStream,
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
  async generateVoiceResponse(
    text: string,
    voice: string = "lauren",
  ): Promise<{
    textResponse: string;
    audioData: any;
  }> {
    try {
      // Get text response from OpenAI
      const textResponse = await this.openaiService.agentBotChat(text);

      // Generate audio file using Speechify
      const audioData = await this.speechifyService.generateTexttoSpeech(
        textResponse,
        voice,
      );

      return {
        textResponse,
        audioData,
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
   * @returns Audio buffer
   */
  async textToVoice(text: string, voice: string = "lauren"): Promise<Buffer> {
    this.logger.log(
      `Converting text to voice: "${text}" with voice: "${voice}"`,
    );
    try {
      const audioBuffer = await this.speechifyService.streamTexttoSpeech(
        text,
        voice,
      );
      this.logger.log(
        `Received audio buffer from Speechify: ${audioBuffer?.length || 0} bytes`,
      );

      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error("Speechify returned empty audio buffer");
      }

      return audioBuffer;
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
  async speechToText(
    audioBuffer: Buffer,
    mimeType: string = "audio/mpeg",
  ): Promise<string> {
    try {
      // Use Deepgram to transcribe the audio buffer
      const transcription = await this.deepgramService.transcribeBuffer(
        audioBuffer,
        mimeType,
      );

      // Extract the transcript text from the response
      const transcribedText =
        transcription?.results?.channels[0]?.alternatives[0]?.transcript || "";

      return transcribedText;
    } catch (error) {
      this.logger.error(`Speech to text error: ${error.message}`);
      throw new Error(`Speech to text error: ${error.message}`);
    }
  }

  /**
   * Converts base64 encoded audio to text using speech recognition
   * @param base64Audio Base64 encoded audio string (without data URI prefix)
   * @param mimeType MIME type of the audio data
   * @returns Transcribed text from the audio
   */
  async speechToTextFromBase64(
    base64Audio: string,
    mimeType: string = "audio/mpeg",
  ): Promise<string> {
    try {
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(base64Audio, "base64");

      // Use the existing method to process the buffer
      return await this.speechToText(audioBuffer, mimeType);
    } catch (error) {
      this.logger.error(`Base64 speech to text error: ${error.message}`);
      throw new Error(`Base64 speech to text error: ${error.message}`);
    }
  }

  /**
   * Generate text-to-speech and save to AWS S3, returning the file URL
   * @param text The text to convert to speech
   * @param voice The voice to use
   * @returns Object with file URL and filename
   */
  async textToVoiceAndSave(
    text: string,
    voice: string = "lauren",
  ): Promise<{
    url: string;
    filename: string;
    key: string;
  }> {
    try {
      // Generate audio buffer
      const audioBuffer = await this.textToVoice(text, voice);

      // Validate buffer
      if (!audioBuffer || audioBuffer.length === 0) {
        throw new Error("Generated audio buffer is empty");
      }

      this.logger.log(`Generated audio buffer: ${audioBuffer.length} bytes`);

      // Create filename with timestamp
      const timestamp = Date.now();
      const filename = `tts-${timestamp}-${voice}.mp3`;
      const objectKey = `speaking-tts-audio/${filename}`;

      // Ensure audioBuffer is a proper Buffer
      const bufferToUpload = Buffer.isBuffer(audioBuffer)
        ? audioBuffer
        : Buffer.from(audioBuffer);

      // Ensure bucket exists
      const bucketExists = await this.awsStorageService.bucketExists(
        this.bucketName,
      );
      if (!bucketExists) {
        await this.awsStorageService.makeBucket(this.bucketName);
        this.logger.log(`Created bucket: ${this.bucketName}`);
      }

      // Upload to AWS S3
      await this.awsStorageService.uploadBuffer(
        this.bucketName,
        objectKey,
        bufferToUpload,
        "audio/mpeg",
      );

      this.logger.log(
        `Uploaded audio file to S3: ${objectKey} (${bufferToUpload.length} bytes)`,
      );

      // Generate presigned URL for direct access (valid for 7 days)
      const presignedUrl = await this.awsStorageService.getPresignedUrl(
        this.bucketName,
        objectKey,
        604800,
      );

      return {
        url: presignedUrl,
        filename,
        key: objectKey,
      };
    } catch (error) {
      this.logger.error(`Text to voice save error: ${error.message}`);
      throw new Error(`Text to voice save error: ${error.message}`);
    }
  }

  /**
   * Get all TTS audio files from the speaking-tts-audio folder in S3
   * @returns Array of file objects with name, size, lastModified, and presigned URL
   */
  async getAllTtsAudioFiles(): Promise<
    Array<{
      name: string;
      size: number;
      lastModified: Date;
      url: string;
    }>
  > {
    try {
      const files = await this.awsStorageService.listFiles(
        this.bucketName,
        "speaking-tts-audio/",
      );

      // Generate presigned URLs for each file
      const filesWithUrls = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          url: await this.awsStorageService.getPresignedUrl(
            this.bucketName,
            file.name,
            604800,
          ),
        })),
      );

      this.logger.log(
        `Retrieved ${filesWithUrls.length} files from speaking-tts-audio folder`,
      );

      return filesWithUrls;
    } catch (error) {
      this.logger.error(`Error getting TTS audio files: ${error.message}`);
      throw new Error(`Error getting TTS audio files: ${error.message}`);
    }
  }
}
