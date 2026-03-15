# AI Chat Bot API — assistant-ui Integration Guide

This document describes how to connect the **Impulse AI Chat Bot** backend to a React Native frontend using [`@assistant-ui/react-native`](https://www.assistant-ui.com/docs/react-native).

---

## Backend API Overview

| Method   | Endpoint                            | Description                          | Auth     |
| -------- | ----------------------------------- | ------------------------------------ | -------- |
| `POST`   | `/ai-chat-bot`                      | Send message & receive streaming response (raw text) | Bearer JWT |
| `GET`    | `/ai-chat-bot`                      | Get chat history for current user    | Bearer JWT |
| `DELETE` | `/ai-chat-bot`                      | Clear all chat history               | Bearer JWT |
| `PATCH`  | `/ai-chat-bot/edit-message/:messageId` | Edit a user message (regenerates AI reply) | Bearer JWT |
| `DELETE` | `/ai-chat-bot/message/:messageId`   | Delete a specific message            | Bearer JWT |

---

## Streaming Endpoint Details

### `POST /ai-chat-bot`

**Request:**

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

```json
{
  "message": "Hello, how can you help me today?"
}
```

**Response:**

```
Content-Type: text/plain
Transfer-Encoding: chunked
Cache-Control: no-cache
Connection: keep-alive
```

The response body is a **raw text stream** — each chunk is a piece of the AI's response written directly to the stream. The chunks concatenated together form the complete response. The connection closes when the response is complete.

Example stream (conceptual):
```
Hello          ← chunk 1
, how can      ← chunk 2
 I help you    ← chunk 3
 today?        ← chunk 4
[connection closes]
```

This format is directly compatible with `assistant-ui`'s `ChatModelAdapter` which reads via `response.body.getReader()`.

---

## Chat History Endpoint

### `GET /ai-chat-bot`

Returns all messages for the authenticated user in chronological order.

**Response:**

```json
[
  {
    "id": "uuid-1",
    "userId": "user-uuid",
    "role": "user",
    "content": "Hello, how can you help me today?",
    "created_at": "2026-03-15T10:00:00.000Z",
    "updated_at": "2026-03-15T10:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "userId": "user-uuid",
    "role": "assistant",
    "content": "Hello! I'm here to help you with anything...",
    "created_at": "2026-03-15T10:00:01.000Z",
    "updated_at": "2026-03-15T10:00:01.000Z"
  }
]
```

---

## React Native Integration (assistant-ui)

### 1. Install dependencies

```bash
npx expo install @assistant-ui/react-native
```

### 2. Create the ChatModelAdapter

The backend streams raw text, which maps directly to the default `ChatModelAdapter` pattern:

```ts
// adapters/impulse-chat-adapter.ts
import type { ChatModelAdapter } from "@assistant-ui/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const impulseChatAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    // Get the JWT token from storage
    const token = await AsyncStorage.getItem("access_token");

    // Get the latest user message
    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage.content
      .filter((p) => p.type === "text")
      .map((p) => ("text" in p ? p.text : ""))
      .join("\n");

    const response = await fetch(`${API_URL}/ai-chat-bot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: messageText }),
      signal: abortSignal,
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      yield { content: [{ type: "text", text: fullText }] };
    }
  },
};
```

### 3. Set up the runtime

```ts
// hooks/use-app-runtime.ts
import { useLocalRuntime } from "@assistant-ui/react-native";
import { impulseChatAdapter } from "@/adapters/impulse-chat-adapter";

export function useAppRuntime() {
  return useLocalRuntime(impulseChatAdapter);
}
```

### 4. Use in your app

```tsx
// app/index.tsx
import { AssistantRuntimeProvider } from "@assistant-ui/react-native";
import { useAppRuntime } from "@/hooks/use-app-runtime";

export default function App() {
  const runtime = useAppRuntime();
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* Your chat UI components */}
    </AssistantRuntimeProvider>
  );
}
```

---

## Message Format Mapping

| assistant-ui field      | Backend field  | Notes                                    |
| ----------------------- | -------------- | ---------------------------------------- |
| `message.role`          | `role`         | `"user"` or `"assistant"`                |
| `message.content[0].text` | `content`    | Backend stores plain text                |
| `message.id`            | `id`           | UUID                                     |
| `message.createdAt`     | `created_at`   | ISO 8601 timestamp                       |

---

## Loading Existing Chat History

To pre-populate the chat with existing history from the backend, fetch `GET /ai-chat-bot` and convert to `assistant-ui` message format:

```ts
// utils/load-chat-history.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

interface BackendMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function loadChatHistory() {
  const token = await AsyncStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/ai-chat-bot`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const messages: BackendMessage[] = await res.json();

  return messages.map((msg) => ({
    role: msg.role,
    content: [{ type: "text" as const, text: msg.content }],
    id: msg.id,
    createdAt: new Date(msg.created_at),
  }));
}
```

---

## Notes

- **Authentication**: All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.
- **Streaming format**: The `POST /ai-chat-bot` endpoint streams **raw text** (not SSE, not JSON). Each chunk written to the response body is a fragment of the AI's reply. This is directly compatible with `assistant-ui`'s `ChatModelAdapter` which reads `response.body.getReader()`.
- **Message persistence**: The backend automatically stores both user and assistant messages in the database. The `ChatModelAdapter` only needs to handle streaming — history is loaded separately via `GET /ai-chat-bot`.
- **Edit/regenerate**: When a user message is edited via `PATCH /ai-chat-bot/edit-message/:messageId`, the backend automatically regenerates the next assistant response (non-streaming).
- **Thread management**: The backend uses a single thread per user (identified by `userId` from JWT). There is no multi-thread support — `DELETE /ai-chat-bot` clears all history to start a new conversation.
