import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/sequelize';
import { AIFeedback } from './entities/ai-feedback.entity.js';
import { DeepgramClient } from '@deepgram/sdk';
import OpenAI from 'openai';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';

interface AiFeedbackJob {
  audioId: number;
  audioUrl: string;
  questionText: string;
  studentId: string;
}

@Processor('ai-feedback')
export class AiFeedbackProcessor {
  private readonly logger = new Logger(AiFeedbackProcessor.name);
  private deepgram: DeepgramClient;
  private openai: OpenAI;

  constructor(
    @InjectModel(AIFeedback)
    private aiFeedbackModel: typeof AIFeedback,
    private eventEmitter: EventEmitter2,
  ) {
    this.deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  @Process('analyze')
  async handleAnalyze(job: Job<AiFeedbackJob>) {
    this.logger.debug(`Starting AI Feedback processing for audio ${job.data.audioId}...`);
    const { audioId, audioUrl, questionText } = job.data;

    try {
      // 1. Download audio buffer from URL
      this.logger.debug(`Downloading audio from ${audioUrl}`);
      const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const audioBuffer = Buffer.from(response.data);

      // 2. Transcribe with Deepgram
      this.logger.debug('Transcribing audio with Deepgram');
      const transcription = await this.transcribeAudio(audioBuffer);

      if (!transcription.transcript.trim()) {
        await this.aiFeedbackModel.create({
          audioId,
          transcript: '',
          grammarScore: 0,
          fluencyWPM: 0,
          fluencyScore: 0,
          vocabDiversity: 0,
          pronScore: 0,
          overallScore: 0,
          aiScore: 0,
          grammarIssues: [],
          vocabSuggestions: [],
          pronIssues: [],
          naturalness: 'No speech was detected in the audio.',
          fillerWords: {},
          pauseCount: 0,
          aiSummary: 'We could not detect any speech. Please try recording again.',
        });
        return;
      }

      // 3. Analyze with OpenAI
      this.logger.debug('Analyzing transcript with OpenAI');
      const analysis = await this.analyzeWithAI(
        transcription.transcript,
        transcription.words,
        transcription.duration,
        questionText || 'Speak naturally about the given topic.',
      );

      let pauseCount = 0;
      for (let i = 1; i < transcription.words.length; i++) {
        if (transcription.words[i].start - transcription.words[i - 1].end > 1.5) {
          pauseCount++;
        }
      }

      const fluencyWPM = transcription.duration > 0
        ? (transcription.words.length / transcription.duration) * 60
        : 0;

      const aiScore = Math.round((analysis.overallScore / 100) * 10);

      // 4. Save to Database
      this.logger.debug('Saving AI Feedback to database');
      await this.aiFeedbackModel.create({
        audioId,
        transcript: transcription.transcript,
        grammarScore: analysis.grammarScore,
        fluencyWPM: Math.round(fluencyWPM * 10) / 10,
        fluencyScore: analysis.fluencyScore,
        vocabDiversity: analysis.vocabDiversity,
        pronScore: analysis.pronScore,
        overallScore: analysis.overallScore,
        aiScore,
        grammarIssues: analysis.grammarIssues,
        vocabSuggestions: analysis.vocabSuggestions,
        pronIssues: analysis.pronIssues,
        naturalness: analysis.naturalness,
        fillerWords: analysis.fillerWords,
        pauseCount,
        aiSummary: analysis.aiSummary,
      });

      this.logger.debug(`Successfully generated AI Feedback for audio ${audioId}`);

      // Emit event for rewards and push notification
      this.eventEmitter.emit('ai-feedback.completed', {
        audioId,
        studentId: job.data.studentId,
        aiScore: analysis.overallScore,
      });
    } catch (error: any) {
      this.logger.error(`Failed to process AI Feedback for audio ${audioId}`, error.stack);
      throw error;
    }
  }

  private async transcribeAudio(audioBuffer: Buffer) {
    const response = await this.deepgram.listen.v1.media.transcribeFile(audioBuffer, {
      model: 'nova-3',
      language: 'en',
      smart_format: true,
      punctuate: true,
      utterances: true,
      diarize: false,
    });

    if (!('results' in response)) {
      throw new Error(`Unexpected Deepgram response (callback mode)`);
    }

    const channel = response.results?.channels?.[0];
    const alternative = channel?.alternatives?.[0];
    const transcript = alternative?.transcript || '';
    const words = ((alternative as any)?.words || []).map((w: any) => ({
      word: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
    }));
    const duration = (response as any).metadata?.duration || 0;

    return { transcript, words, duration };
  }

  private async analyzeWithAI(
    transcript: string,
    words: any[],
    duration: number,
    questionText: string,
  ) {
    const wordCount = words.length;
    const fluencyWPM = duration > 0 ? (wordCount / duration) * 60 : 0;

    const fillerPatterns = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'actually', 'so', 'well'];
    const fillerWords: Record<string, number> = {};
    const lowerTranscript = transcript.toLowerCase();
    for (const filler of fillerPatterns) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerTranscript.match(regex);
      if (matches && matches.length > 0) {
        fillerWords[filler] = matches.length;
      }
    }

    const avgConfidence = words.length > 0
      ? words.reduce((sum, w) => sum + w.confidence, 0) / words.length
      : 0;

    let pauseCount = 0;
    for (let i = 1; i < words.length; i++) {
      if (words[i].start - words[i - 1].end > 1.5) {
        pauseCount++;
      }
    }

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert English language speaking assessor. Analyze the student's spoken response and provide structured feedback. Return JSON with these exact fields:
  
  {
    "grammarScore": <0-100 integer>,
    "fluencyScore": <0-100 integer>,
    "vocabDiversity": <0-100 integer>,
    "overallScore": <0-100 integer>,
    "grammarIssues": [{"original": "what they said", "corrected": "correct version", "explanation": "brief rule"}],
    "vocabSuggestions": [{"word": "overused word", "alternatives": ["better option 1", "better option 2"], "context": "in what context"}],
    "naturalness": "A 2-3 sentence assessment of how natural this sounds to a native speaker, with specific suggestions",
    "aiSummary": "A brief encouraging 2-sentence summary of their performance with one key improvement area"
  }
  
  Scoring guide:
  - grammarScore: 90-100 = near-native, 70-89 = good with minor errors, 50-69 = understandable with noticeable errors, below 50 = significant errors
  - fluencyScore: Consider the WPM (${fluencyWPM.toFixed(0)}), pause count (${pauseCount}), and filler word usage. Natural speech is 120-150 WPM.
  - vocabDiversity: Variety of vocabulary, avoidance of repetition, appropriate word choices
  - overallScore: Weighted combination of all factors
  
  Keep grammarIssues to max 5 most important. Keep vocabSuggestions to max 3.`,
        },
        {
          role: 'user',
          content: `Question/Prompt: "${questionText}"
  
  Student's spoken response (transcript): "${transcript}"
  
  Additional metrics:
  - Words per minute: ${fluencyWPM.toFixed(1)}
  - Total words: ${wordCount}
  - Duration: ${duration.toFixed(1)}s
  - Pause count (>1.5s gaps): ${pauseCount}
  - Filler words detected: ${JSON.stringify(fillerWords)}
  - Average pronunciation confidence: ${(avgConfidence * 100).toFixed(1)}%`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || '{}';
    let analysis: any;
    try {
      analysis = JSON.parse(content);
    } catch {
      analysis = {};
    }

    return {
      grammarScore: this.clamp(analysis.grammarScore ?? 50, 0, 100),
      fluencyScore: this.clamp(analysis.fluencyScore ?? 50, 0, 100),
      vocabDiversity: this.clamp(analysis.vocabDiversity ?? 50, 0, 100),
      pronScore: this.clamp(Math.round(avgConfidence * 100), 0, 100),
      overallScore: this.clamp(analysis.overallScore ?? 50, 0, 100),
      grammarIssues: Array.isArray(analysis.grammarIssues) ? analysis.grammarIssues.slice(0, 5) : [],
      vocabSuggestions: Array.isArray(analysis.vocabSuggestions) ? analysis.vocabSuggestions.slice(0, 3) : [],
      pronIssues: this.buildPronIssues(words),
      naturalness: analysis.naturalness || '',
      fillerWords,
      aiSummary: analysis.aiSummary || '',
    };
  }

  private buildPronIssues(words: any[]) {
    return words
      .filter((w) => w.confidence < 0.75)
      .slice(0, 5)
      .map((w) => ({
        word: w.word,
        issue: `Low clarity (${Math.round(w.confidence * 100)}% confidence)`,
        tip: `Try pronouncing "${w.word}" more clearly with emphasis on each syllable`,
      }));
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, Math.round(value)));
  }
}
