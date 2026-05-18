// Socket.IO payload shapes for WebRTC signaling (user <-> user audio).
// These are not REST DTOs; they document the event contract between
// the mobile client and the AudioCallGateway.

export interface InviteCallDto {
  // The user being called
  callee_id: string;
}

export interface CallAnswerDto {
  call_id: string;
}

export interface SdpDto {
  call_id: string;
  // RTCSessionDescriptionInit serialized from the client
  sdp: { type: "offer" | "answer"; sdp: string };
}

export interface IceCandidateDto {
  call_id: string;
  // RTCIceCandidateInit serialized from the client
  candidate: {
    candidate: string;
    sdpMid?: string | null;
    sdpMLineIndex?: number | null;
    usernameFragment?: string | null;
  };
}

export interface HangupDto {
  call_id: string;
  reason?: string;
}
