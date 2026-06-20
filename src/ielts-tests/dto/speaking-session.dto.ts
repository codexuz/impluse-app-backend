// Socket.IO payload shapes for the real-time AI IELTS Speaking examiner
// on the IeltsSpeakingGateway (/ielts-speaking namespace).

export interface StartSpeakingSessionDto {
  // The speaking topic (IeltsSpeaking) to run the exam from.
  speaking_id: string;
  // Optional Realtime voice override (falls back to the topic's voice).
  voice?: string;
}

export interface SpeakingAudioChunkDto {
  session_id: string;
  // base64-encoded PCM16 mono 24kHz audio captured from the mic.
  audio: string;
}

export interface MuteSpeakingDto {
  session_id: string;
  muted: boolean;
}

export interface EndSpeakingDto {
  session_id: string;
}
