// Socket.IO payload shapes for the user <-> AI Realtime audio call
// on the AudioCallGateway (/call namespace).

export interface StartAiCallDto {
  // Optional override of the AI persona / behaviour
  instructions?: string;
  // Optional Realtime voice name (e.g. "alloy", "verse", "marin")
  voice?: string;
}

export interface AiAudioChunkDto {
  call_id: string;
  // base64-encoded PCM16 mono 24kHz audio captured from the mic
  audio: string;
}

export interface AiCommitDto {
  // Signals end of the user's utterance when server VAD is disabled
  call_id: string;
}

export interface MuteAiCallDto {
  call_id: string;
  // true: stop forwarding the user's mic audio to the AI; false: resume
  muted: boolean;
}

export interface EndAiCallDto {
  call_id: string;
}
