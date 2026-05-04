# Homework Submissions API Guide

## Overview

The Homework Submissions API allows students to submit homework answers section by section. The system tracks first attempts and awards rewards (points, coins, streaks) when a student scores ≥ 80% on their first try.

---

## Authentication

All endpoints require a valid JWT Bearer token.

```
Authorization: Bearer <your_jwt_token>
```

The `student_id` is **automatically extracted from the JWT token** — do not include it in the request body.

---

## Endpoints

### `POST /homework-submissions/section`

Save a homework submission for a specific section. Creates a new submission/section if one does not exist, or updates an existing one.

**Role required:** `STUDENT`

#### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `homework_id` | `string (UUID)` | Optional* | UUID of the homework assignment |
| `lesson_id` | `string (UUID)` | Optional* | UUID of the lesson |
| `exercise_id` | `string (UUID)` | Optional | UUID of the exercise within the section |
| `speaking_id` | `string (UUID)` | Optional | UUID of the speaking exercise (for speaking sections) |
| `percentage` | `number (0–100)` | Optional | Score achieved in this section |
| `section` | `string (enum)` | Required | Section type: `reading`, `listening`, `grammar`, `writing`, `speaking` |
| `answers` | `object` | Optional | Student answers, e.g. `{ "q1": "answer" }` |

> *Either `homework_id` or `lesson_id` must be provided to identify the submission.

#### Example Request

```json
POST /homework-submissions/section
Authorization: Bearer <token>
Content-Type: application/json

{
  "homework_id": "abc123e4-e89b-12d3-a456-426614174000",
  "lesson_id": "def456e4-e89b-12d3-a456-426614174000",
  "exercise_id": "exr789e4-e89b-12d3-a456-426614174000",
  "section": "reading",
  "percentage": 85,
  "answers": {
    "q1": "Paris",
    "q2": "True",
    "q3": "B"
  }
}
```

---

## Response

### `201 Created` — With Rewards (first attempt, score ≥ 80%)

```json
{
  "submission": {
    "id": "sub-uuid",
    "homework_id": "abc123e4-...",
    "student_id": "stu-uuid",
    "lesson_id": "def456e4-...",
    "createdAt": "2026-05-04T10:00:00.000Z",
    "updatedAt": "2026-05-04T10:00:00.000Z"
  },
  "section": {
    "id": "sec-uuid",
    "submission_id": "sub-uuid",
    "exercise_id": "exr789e4-...",
    "score": 85,
    "section": "reading",
    "answers": {
      "q1": "Paris",
      "q2": "True",
      "q3": "B"
    },
    "createdAt": "2026-05-04T10:00:00.000Z",
    "updatedAt": "2026-05-04T10:00:00.000Z"
  },
  "rewards": {
    "coins": 2,
    "streak": 1,
    "bonusPoints": 5,
    "totalEarnedPoints": 90
  }
}
```

### `201 Created` — No Rewards (retrying or score < 80%)

```json
{
  "submission": { ... },
  "section": { ... },
  "rewards": null
}
```

---

## Reward Logic

Rewards are granted **only on the first attempt** and only when the score is **≥ 80%**.

| Condition | Coins | Bonus Points | Streak |
|---|---|---|---|
| First attempt AND score ≥ 80% | +2 | +5 | +1 |
| Retry (any score) | 0 | 0 | 0 |
| First attempt AND score < 80% | 0 | 0 | 0 |

### `totalEarnedPoints` Calculation

```
totalEarnedPoints = round(score + bonusPoints)
// e.g. round(85 + 5) = 90
```

The following are credited to the student's profile:
- **Points**: `totalEarnedPoints` added via `StudentProfile.points`
- **Coins**: `+2` added via `StudentProfile.coins`
- **Streak**: incremented via `StudentProfile.streaks`

---

## Lesson Progress Auto-Update

When a section is saved with a score **≥ 60**, the system automatically:

1. Updates the specific section progress (`reading_completed`, `listening_completed`, etc.) in `LessonProgress`.
2. Checks if all required sections have been completed and updates the overall lesson progress.

This happens silently — failures do not block the submission response.

---

## Writing Section Auto-Assessment

If `section` is `"writing"`, the API automatically sends the answers to OpenAI for assessment. The `answers` object must include a `writing` key:

```json
{
  "section": "writing",
  "answers": {
    "writing": "The student's written response text goes here."
  }
}
```

The section's `score` and `answers` will be updated with the AI assessment result before the response is returned.

---

## Section Deduplication

The API uses `exercise_id` + `section` to determine if a section already exists for the submission:

- **If a section with the same `exercise_id` and `section` exists** → it is updated (retry, no rewards).
- **If no matching section exists** → a new section is created (first attempt, rewards eligible).

---

## Frontend Integration Example

```typescript
async function submitSection(token: string, payload: SubmitSectionPayload) {
  const res = await fetch('/homework-submissions/section', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.rewards) {
    showRewardModal({
      coins: data.rewards.coins,
      streak: data.rewards.streak,
      bonusPoints: data.rewards.bonusPoints,
      totalEarnedPoints: data.rewards.totalEarnedPoints,
    });
  }

  return data;
}
```

### Payload Type

```typescript
interface SubmitSectionPayload {
  homework_id?: string;
  lesson_id?: string;
  exercise_id?: string;
  speaking_id?: string;
  section: 'reading' | 'listening' | 'grammar' | 'writing' | 'speaking';
  percentage?: number;
  answers?: Record<string, any>;
}
```

> Do **not** include `student_id` in the payload — it is injected automatically from the JWT token.

---

## Error Responses

| Status | Description |
|---|---|
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | User does not have the `STUDENT` role |
| `400 Bad Request` | Validation error in request body |
