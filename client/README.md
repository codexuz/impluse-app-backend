# Audio Call — Web Test Client

A zero-build HTML/CSS/JS client to exercise the `AudioCallGateway`
(`/call` Socket.IO namespace) without the mobile app.

## What it tests

| Panel | Backend surface |
|-------|-----------------|
| **Connect** | `POST /api/auth/student/login` → JWT, then Socket.IO handshake `auth.token` |
| **Peer-to-peer call** | `call:invite/incoming/accept/reject/offer/answer/ice-candidate/hangup/ended` + `GET /api/audio-call/ice-servers` |
| **AI tutor call** | `ai-call:start/audio/commit/end` + transcript & lifecycle events. Mic captured via Web Audio, resampled to **PCM16 mono 24 kHz** to match `openai-realtime.service.ts` |

## Run

The page only needs a static file server (the `getUserMedia` mic API
requires a **secure context** — `http://localhost` counts as secure).

```bash
# from the repo root
npx serve client
#   or
python -m http.server 5500 --directory client
```

Then open the printed URL (e.g. `http://localhost:3000`/`:5500`).

Make sure the backend is running (default `http://localhost:3000`).

## Usage

1. **Connect** — set the backend base URL, enter a student username/password,
   click *Log in & connect*. (Or click *Use a token instead* to paste a JWT.)
   On success the page prints **your user ID** and the badge turns green
   once `call:ready` arrives.
2. **Peer-to-peer** — open the page a second time (other browser / profile /
   incognito) and log in as a different user. Copy that user's printed ID
   into *Callee user ID* on the first tab and click **Call**. Accept on the
   other tab. You should hear two-way audio.
3. **AI tutor** — click **Start AI call**, allow the mic, and talk. The
   backend's server-side VAD auto-commits turns; the reply streams back and
   plays through the speakers. Requires `OPENAI_API_KEY` set on the backend
   (otherwise you get `call:error — AI calling is not configured.`).

## Notes & limitations

- **Mic over LAN/remote:** browsers block `getUserMedia` on plain `http://`
  for non-localhost origins. To test from another device, serve the client
  over HTTPS (or use an SSH/ngrok tunnel) and point the base URL at an
  `https://` backend.
- **Two users on one machine:** use two different browsers or an
  incognito window so the JWTs/sockets don't collide.
- The Socket.IO namespace is `<base>/call` — gateways are **not** under the
  REST `/api` prefix. The client builds this URL automatically.
- `ScriptProcessorNode` is used for mic capture: deprecated but universally
  supported and adequate for manual testing.
- This is a **test harness**, not production code — no token refresh, minimal
  error recovery.
