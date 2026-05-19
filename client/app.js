/* Impulse Audio Call — browser test client.
 *
 * Mirrors the backend AudioCallGateway contract (namespace "/call"):
 *  - p2p: call:invite / call:incoming / call:accept|reject / call:offer
 *         / call:answer / call:ice-candidate / call:hangup / call:ended
 *  - AI : ai-call:start / ai-call:audio (both ways) / ai-call:commit
 *         / ai-call:end + transcript + lifecycle events
 *
 * Audio for the AI call is PCM16 mono 24 kHz (base64), matching
 * openai-realtime.service.ts.
 */
(() => {
  "use strict";

  const REALTIME_RATE = 24000;

  // ── DOM helpers ──────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const els = {
    baseUrl: $("baseUrl"),
    username: $("username"),
    password: $("password"),
    loginBtn: $("loginBtn"),
    tokenToggle: $("tokenToggle"),
    tokenWrap: $("tokenWrap"),
    tokenInput: $("tokenInput"),
    connectTokenBtn: $("connectTokenBtn"),
    me: $("me"),
    connBadge: $("connBadge"),

    calleeId: $("calleeId"),
    callBtn: $("callBtn"),
    acceptBtn: $("acceptBtn"),
    rejectBtn: $("rejectBtn"),
    muteBtn: $("muteBtn"),
    hangupBtn: $("hangupBtn"),
    p2pStatus: $("p2pStatus"),
    remoteAudio: $("remoteAudio"),

    aiVoice: $("aiVoice"),
    aiInstructions: $("aiInstructions"),
    aiStartBtn: $("aiStartBtn"),
    aiEndBtn: $("aiEndBtn"),
    aiStatus: $("aiStatus"),
    userTranscript: $("userTranscript"),
    aiTranscript: $("aiTranscript"),

    log: $("log"),
    clearLog: $("clearLog"),
  };

  function log(msg, kind = "sys") {
    const t = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.className = "log-" + kind;
    line.textContent = `[${t}] ${msg}`;
    els.log.appendChild(line);
    els.log.scrollTop = els.log.scrollHeight;
  }

  // ── State ────────────────────────────────────────────────────────────────
  let socket = null;
  let token = null;
  let myUserId = null;

  // p2p
  let pc = null;
  let localStream = null;
  let currentCallId = null;
  let pendingIce = [];
  let muted = false;

  // ai
  let aiCallId = null;
  let micCtx = null;
  let micNode = null;
  let micSource = null;
  let micStream = null;
  let playCtx = null;
  let playCursor = 0; // scheduled playback time

  // ── Auth ─────────────────────────────────────────────────────────────────
  function baseUrl() {
    return els.baseUrl.value.trim().replace(/\/+$/, "");
  }

  async function login() {
    const username = els.username.value.trim();
    const password = els.password.value;
    if (!username || !password) {
      log("Enter username and password", "err");
      return;
    }
    try {
      log(`POST ${baseUrl()}/api/auth/student/login …`);
      const res = await fetch(`${baseUrl()}/api/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        log(`Login failed: HTTP ${res.status}`, "err");
        return;
      }
      const data = await res.json();
      token = data.access_token;
      myUserId = data.user?.id || null;
      els.me.textContent = `Logged in as ${
        data.user?.username || username
      } — your user ID: ${myUserId}`;
      log("Login OK, connecting socket…", "out");
      connectSocket();
    } catch (e) {
      log("Login error: " + e.message, "err");
    }
  }

  function connectWithToken() {
    token = els.tokenInput.value.trim();
    if (!token) {
      log("Paste a token first", "err");
      return;
    }
    log("Connecting socket with provided token…");
    connectSocket();
  }

  // ── Socket ───────────────────────────────────────────────────────────────
  function connectSocket() {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    // Gateways ignore the global "api" prefix → namespace is <base>/call
    socket = io(`${baseUrl()}/call`, {
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
    });

    socket.on("connect", () => {
      setBadge(true);
      log("socket connected: " + socket.id, "out");
    });
    socket.on("disconnect", (r) => {
      setBadge(false);
      log("socket disconnected: " + r, "sys");
    });
    socket.on("connect_error", (e) =>
      log("connect_error: " + e.message, "err"),
    );

    socket.on("call:ready", (p) => {
      myUserId = myUserId || p.user_id;
      log("call:ready — user_id " + p.user_id, "in");
      els.callBtn.disabled = false;
      els.aiStartBtn.disabled = false;
    });
    socket.on("call:error", (p) =>
      log("call:error — " + (p.message || JSON.stringify(p)), "err"),
    );

    bindP2P();
    bindAI();
  }

  function setBadge(on) {
    els.connBadge.textContent = on ? "connected" : "disconnected";
    els.connBadge.className = "badge " + (on ? "on" : "off");
  }

  // ── P2P WebRTC ───────────────────────────────────────────────────────────
  async function getIceServers() {
    try {
      const res = await fetch(`${baseUrl()}/api/audio-call/ice-servers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return (await res.json()).iceServers || [];
    } catch (_) {
      /* fall through to default */
    }
    return [{ urls: "stun:stun.l.google.com:19302" }];
  }

  async function buildPc() {
    const iceServers = await getIceServers();
    pc = new RTCPeerConnection({ iceServers });
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.ontrack = (ev) => {
      els.remoteAudio.srcObject = ev.streams[0];
      log("remote audio track received", "in");
    };
    pc.onicecandidate = (ev) => {
      if (ev.candidate && currentCallId) {
        socket.emit("call:ice-candidate", {
          call_id: currentCallId,
          candidate: ev.candidate.toJSON(),
        });
      }
    };
    pc.onconnectionstatechange = () => {
      log("pc state: " + pc.connectionState, "sys");
      if (pc.connectionState === "connected") setP2P("connected");
      if (["failed", "closed"].includes(pc.connectionState)) endP2P("lost");
    };
    return pc;
  }

  async function flushIce() {
    for (const c of pendingIce) {
      try {
        await pc.addIceCandidate(c);
      } catch (_) {
        /* ignore late candidate */
      }
    }
    pendingIce = [];
  }

  function setP2P(s) {
    els.p2pStatus.textContent = s;
  }

  function showP2PButtons({ call, accept, reject, mute, hangup }) {
    els.callBtn.hidden = !call;
    els.acceptBtn.hidden = !accept;
    els.rejectBtn.hidden = !reject;
    els.muteBtn.hidden = !mute;
    els.hangupBtn.hidden = !hangup;
  }

  function endP2P(reason) {
    if (pc) pc.close();
    pc = null;
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
    localStream = null;
    pendingIce = [];
    currentCallId = null;
    muted = false;
    els.muteBtn.textContent = "🔇 Mute";
    setP2P("ended" + (reason ? ` (${reason})` : ""));
    showP2PButtons({ call: true });
  }

  function bindP2P() {
    socket.on("call:ringing", (p) => {
      currentCallId = p.call_id;
      setP2P("calling…");
      log("call:ringing " + p.call_id, "in");
      showP2PButtons({ hangup: true });
    });

    socket.on("call:incoming", (p) => {
      currentCallId = p.call_id;
      setP2P(`incoming from ${p.caller_username}`);
      log(`call:incoming from ${p.caller_username} (${p.caller_id})`, "in");
      showP2PButtons({ accept: true, reject: true });
    });

    socket.on("call:unavailable", () => {
      log("call:unavailable — callee offline", "err");
      endP2P("unavailable");
    });

    // We are the caller → create the offer.
    socket.on("call:accepted", async (p) => {
      currentCallId = p.call_id;
      setP2P("connecting…");
      log("call:accepted — creating offer", "in");
      await buildPc();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call:offer", {
        call_id: p.call_id,
        sdp: { type: "offer", sdp: offer.sdp },
      });
      showP2PButtons({ mute: true, hangup: true });
    });

    // We are the callee → answer the offer.
    socket.on("call:offer", async (p) => {
      currentCallId = p.call_id;
      setP2P("connecting…");
      log("call:offer received", "in");
      if (!pc) await buildPc();
      await pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
      await flushIce();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("call:answer", {
        call_id: p.call_id,
        sdp: { type: "answer", sdp: answer.sdp },
      });
      showP2PButtons({ mute: true, hangup: true });
    });

    socket.on("call:answer", async (p) => {
      log("call:answer received", "in");
      await pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
      await flushIce();
    });

    socket.on("call:ice-candidate", async (p) => {
      const c = new RTCIceCandidate(p.candidate);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(c);
        } catch (_) {
          /* ignore */
        }
      } else {
        pendingIce.push(c);
      }
    });

    socket.on("call:ended", (p) => {
      log("call:ended — " + p.reason, "in");
      endP2P(p.reason);
    });
  }

  function callUser() {
    const callee = els.calleeId.value.trim();
    if (!callee) {
      log("Enter a callee user ID", "err");
      return;
    }
    setP2P("inviting…");
    socket.emit("call:invite", { callee_id: callee });
    log("emit call:invite → " + callee, "out");
    showP2PButtons({ hangup: true });
  }

  async function acceptCall() {
    if (!currentCallId) return;
    setP2P("accepting…");
    await buildPc(); // prebuild so mic prompt + ICE start early
    socket.emit("call:accept", { call_id: currentCallId });
    log("emit call:accept", "out");
    showP2PButtons({ mute: true, hangup: true });
  }

  function rejectCall() {
    if (!currentCallId) return;
    socket.emit("call:reject", { call_id: currentCallId });
    log("emit call:reject", "out");
    endP2P("rejected");
  }

  function hangup() {
    if (currentCallId) {
      socket.emit("call:hangup", { call_id: currentCallId, reason: "hangup" });
      log("emit call:hangup", "out");
    }
    endP2P("hangup");
  }

  function toggleMute() {
    if (!localStream) return;
    muted = !muted;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !muted));
    els.muteBtn.textContent = muted ? "🔊 Unmute" : "🔇 Mute";
  }

  // ── AI call: PCM helpers ─────────────────────────────────────────────────
  function floatToPcm16(float32) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  function pcm16ToFloat(int16) {
    const out = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) out[i] = int16[i] / 0x8000;
    return out;
  }

  function int16ToBase64(int16) {
    const bytes = new Uint8Array(int16.buffer);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function base64ToInt16(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    // Ensure even length for Int16 view.
    const usable = bytes.length - (bytes.length % 2);
    return new Int16Array(bytes.buffer, 0, usable / 2);
  }

  // Linear resample mono Float32 between sample rates.
  function resampleFloat(input, fromRate, toRate) {
    if (fromRate === toRate) return input;
    const ratio = fromRate / toRate;
    const outLen = Math.round(input.length / ratio);
    const out = new Float32Array(outLen);
    for (let i = 0; i < outLen; i++) {
      const pos = i * ratio;
      const i0 = Math.floor(pos);
      const i1 = Math.min(i0 + 1, input.length - 1);
      const frac = pos - i0;
      out[i] = input[i0] * (1 - frac) + input[i1] * frac;
    }
    return out;
  }

  // ── AI call ──────────────────────────────────────────────────────────────
  function setAI(s) {
    els.aiStatus.textContent = s;
  }

  function bindAI() {
    socket.on("ai-call:started", async (p) => {
      aiCallId = p.call_id;
      log("ai-call:started " + p.call_id, "in");
      setAI("listening — speak now");
      await startMic();
    });

    socket.on("ai-call:audio", (p) => {
      playPcmChunk(base64ToInt16(p.audio));
    });

    socket.on("ai-call:ai-transcript", (p) => {
      els.aiTranscript.textContent += p.text;
    });
    socket.on("ai-call:user-transcript", (p) => {
      els.userTranscript.textContent = p.text;
    });
    socket.on("ai-call:speech-started", () => {
      log("ai-call:speech-started (barge-in)", "in");
      els.aiTranscript.textContent = "";
      playCursor = 0; // drop queued playback
      setAI("listening…");
    });
    socket.on("ai-call:response-done", () => {
      log("ai-call:response-done", "in");
      setAI("listening…");
    });
  }

  async function startAiCall() {
    els.userTranscript.textContent = "";
    els.aiTranscript.textContent = "";
    setAI("starting…");
    playCtx = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: REALTIME_RATE,
    });
    playCursor = playCtx.currentTime;
    socket.emit("ai-call:start", {
      voice: els.aiVoice.value || undefined,
      instructions: els.aiInstructions.value.trim() || undefined,
    });
    log("emit ai-call:start", "out");
    els.aiStartBtn.hidden = true;
    els.aiEndBtn.hidden = false;
  }

  async function startMic() {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micCtx = new (window.AudioContext || window.webkitAudioContext)();
    micSource = micCtx.createMediaStreamSource(micStream);

    // ScriptProcessor is deprecated but universally available and fine for
    // a test client. 4096-frame buffer ≈ 85 ms at the mic's native rate.
    micNode = micCtx.createScriptProcessor(4096, 1, 1);
    micSource.connect(micNode);
    micNode.connect(micCtx.destination);

    micNode.onaudioprocess = (ev) => {
      if (!aiCallId) return;
      const input = ev.inputBuffer.getChannelData(0);
      const up = resampleFloat(input, micCtx.sampleRate, REALTIME_RATE);
      const pcm = floatToPcm16(up);
      socket.emit("ai-call:audio", {
        call_id: aiCallId,
        audio: int16ToBase64(pcm),
      });
    };
    log(`mic open @ ${micCtx.sampleRate} Hz → resampling to 24 kHz`, "sys");
  }

  // Schedule each received PCM chunk back-to-back for gapless playback.
  function playPcmChunk(int16) {
    if (!playCtx) return;
    const float = pcm16ToFloat(int16);
    const buf = playCtx.createBuffer(1, float.length, REALTIME_RATE);
    buf.copyToChannel(float, 0);
    const src = playCtx.createBufferSource();
    src.buffer = buf;
    src.connect(playCtx.destination);
    const now = playCtx.currentTime;
    if (playCursor < now) playCursor = now;
    src.start(playCursor);
    playCursor += buf.duration;
    setAI("speaking…");
  }

  function endAiCall() {
    if (aiCallId) {
      socket.emit("ai-call:end", { call_id: aiCallId });
      log("emit ai-call:end", "out");
    }
    aiCallId = null;
    if (micNode) micNode.disconnect();
    if (micSource) micSource.disconnect();
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    if (micCtx) micCtx.close();
    if (playCtx) playCtx.close();
    micNode = micSource = micStream = micCtx = playCtx = null;
    setAI("ended");
    els.aiStartBtn.hidden = false;
    els.aiEndBtn.hidden = true;
  }

  // ── Wiring ───────────────────────────────────────────────────────────────
  els.loginBtn.onclick = login;
  els.connectTokenBtn.onclick = connectWithToken;
  els.tokenToggle.onclick = () => {
    els.tokenWrap.hidden = !els.tokenWrap.hidden;
  };
  els.callBtn.onclick = callUser;
  els.acceptBtn.onclick = acceptCall;
  els.rejectBtn.onclick = rejectCall;
  els.hangupBtn.onclick = hangup;
  els.muteBtn.onclick = toggleMute;
  els.aiStartBtn.onclick = startAiCall;
  els.aiEndBtn.onclick = endAiCall;
  els.clearLog.onclick = () => (els.log.textContent = "");

  log("Ready. Set the backend URL and log in.", "sys");
})();
