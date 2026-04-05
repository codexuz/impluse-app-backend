# Exercises API - Frontend & Expo Integration Guide

> **Base URL:** `/exercise`  
> **Auth:** `Authorization: Bearer <JWT_TOKEN>`  
> **Roles:** ADMIN, TEACHER (create/update/delete), STUDENT (read)

---

## 1. Overview

The Exercises API supports **9 question types** within exercises. Each exercise belongs to a lesson and contains an array of questions. Each question has a `question_type` that determines which data field is populated.

### Exercise Types

| Value | Description |
|-------|-------------|
| `grammar` | Grammar exercises |
| `reading` | Reading comprehension |
| `listening` | Listening exercises |
| `writing` | Writing exercises |

### Question Types

| Value | Data Field | Description |
|-------|-----------|-------------|
| `multiple_choice` | `choices` | Pick one correct answer from options |
| `fill_in_the_blank` | `gap_filling` | Fill gaps in a sentence |
| `true_false` | `choices` | True/False selection (uses choices) |
| `short_answer` | `typing_exercise` | Type the correct answer |
| `matching` | `matching_pairs` | Match left items to right items |
| `sentence_build` | `sentence_build` | Reorder words to build a sentence |
| `translation` | `translation` | Translate given text |
| `dictation` | `dictation` | Listen to audio and type what you hear |
| `listen_and_choose` | `listen_and_choose` | Listen to audio and choose correct option |

---

## 2. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/exercise` | Create exercise with questions |
| `GET` | `/exercise` | Get all exercises |
| `GET` | `/exercise/:id` | Get single exercise with all data |
| `GET` | `/exercise/:id/questions` | Get questions for an exercise |
| `GET` | `/exercise/lesson/:lessonId` | Get exercises for a lesson |
| `GET` | `/exercise/type/:exerciseType` | Get exercises by type |
| `GET` | `/exercise/type/:exerciseType/lesson/:lessonId` | Get by type + lesson (includes student score) |
| `PATCH` | `/exercise/:id` | Update exercise + questions |
| `DELETE` | `/exercise/:id` | Soft delete exercise |

---

## 3. Response Shape

When fetching an exercise, questions come nested with their type-specific data:

```json
{
  "id": "uuid",
  "title": "Present Simple Grammar Exercise",
  "exercise_type": "grammar",
  "audio_url": null,
  "image_url": null,
  "video_url": null,
  "instructions": "Complete the exercises below",
  "content": null,
  "isActive": true,
  "lessonId": "uuid",
  "questions": [
    {
      "id": "uuid",
      "exercise_id": "uuid",
      "question_type": "multiple_choice",
      "question_text": "She ___ to school every day.",
      "points": 10,
      "order_number": 1,
      "sample_answer": null,
      "choices": [...],
      "gap_filling": [],
      "matching_pairs": [],
      "typing_exercise": null,
      "sentence_build": [],
      "translation": [],
      "dictation": [],
      "listen_and_choose": []
    }
  ]
}
```

---

## 4. Question Type Details & Examples

### 4.1 Multiple Choice

User selects one correct answer from a list.

**Response data:**
```json
{
  "question_type": "multiple_choice",
  "question_text": "She ___ to school every day.",
  "choices": [
    { "id": "uuid", "option_text": "goes", "is_correct": true },
    { "id": "uuid", "option_text": "go", "is_correct": false },
    { "id": "uuid", "option_text": "going", "is_correct": false }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "multiple_choice",
  "question_text": "She ___ to school every day.",
  "order_number": 1,
  "points": 10,
  "choices": [
    { "option_text": "goes", "is_correct": true },
    { "option_text": "go", "is_correct": false },
    { "option_text": "going", "is_correct": false }
  ]
}
```

---

### 4.2 Fill in the Blank

User fills one or more gaps in a sentence. Gaps are indicated by `___` in `question_text`.

**Response data:**
```json
{
  "question_type": "fill_in_the_blank",
  "question_text": "She ___ to school and ___ her homework.",
  "gap_filling": [
    { "id": "uuid", "gap_number": 1, "correct_answer": ["goes", "walks"] },
    { "id": "uuid", "gap_number": 2, "correct_answer": ["does", "finishes"] }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "fill_in_the_blank",
  "question_text": "She ___ to school and ___ her homework.",
  "order_number": 2,
  "points": 10,
  "gap_filling": [
    { "gap_number": 1, "correct_answer": ["goes", "walks"] },
    { "gap_number": 2, "correct_answer": ["does", "finishes"] }
  ]
}
```

---

### 4.3 True / False

Uses the same `choices` structure with two options.

**Response data:**
```json
{
  "question_type": "true_false",
  "question_text": "The sun rises in the west.",
  "choices": [
    { "id": "uuid", "option_text": "True", "is_correct": false },
    { "id": "uuid", "option_text": "False", "is_correct": true }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "true_false",
  "question_text": "The sun rises in the west.",
  "order_number": 3,
  "points": 5,
  "choices": [
    { "option_text": "True", "is_correct": false },
    { "option_text": "False", "is_correct": true }
  ]
}
```

---

### 4.4 Short Answer (Typing)

User types a free-text answer, checked against the correct answer.

**Response data:**
```json
{
  "question_type": "short_answer",
  "question_text": "What is the past tense of 'go'?",
  "typing_exercise": {
    "id": "uuid",
    "correct_answer": "went",
    "is_case_sensitive": false
  }
}
```

**Create payload:**
```json
{
  "question_type": "short_answer",
  "question_text": "What is the past tense of 'go'?",
  "order_number": 4,
  "points": 10,
  "typing_exercise": {
    "correct_answer": "went",
    "is_case_sensitive": false
  }
}
```

---

### 4.5 Matching

User matches left-side items to right-side items (drag & drop or select).

**Response data:**
```json
{
  "question_type": "matching",
  "question_text": "Match the animals to their categories",
  "matching_pairs": [
    { "id": "uuid", "left_item": "cat", "right_item": "animal" },
    { "id": "uuid", "left_item": "rose", "right_item": "flower" },
    { "id": "uuid", "left_item": "oak", "right_item": "tree" }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "matching",
  "question_text": "Match the animals to their categories",
  "order_number": 5,
  "points": 15,
  "matching_pairs": [
    { "left_item": "cat", "right_item": "animal" },
    { "left_item": "rose", "right_item": "flower" },
    { "left_item": "oak", "right_item": "tree" }
  ]
}
```

---

### 4.6 Sentence Build

User is given scrambled words and must arrange them into the correct sentence.

**Response data:**
```json
{
  "question_type": "sentence_build",
  "question_text": "Arrange the words to form a correct sentence",
  "sentence_build": [
    {
      "id": "uuid",
      "given_text": "school to every she goes day",
      "correct_answer": "She goes to school every day"
    }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "sentence_build",
  "question_text": "Arrange the words to form a correct sentence",
  "order_number": 6,
  "points": 10,
  "sentence_build": {
    "given_text": "school to every she goes day",
    "correct_answer": "She goes to school every day"
  }
}
```

---

### 4.7 Translation

User is given text in one language and must type the translation.

**Response data:**
```json
{
  "question_type": "translation",
  "question_text": "Translate the following sentence",
  "translation": [
    {
      "id": "uuid",
      "given_text": "The cat is sitting on the table",
      "correct_answer": "Mushuk stol ustida o'tiribdi"
    }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "translation",
  "question_text": "Translate the following sentence",
  "order_number": 7,
  "points": 10,
  "translation": {
    "given_text": "The cat is sitting on the table",
    "correct_answer": "Mushuk stol ustida o'tiribdi"
  }
}
```

---

### 4.8 Dictation

User listens to audio and types what they hear.

**Response data:**
```json
{
  "question_type": "dictation",
  "question_text": "Listen and type what you hear",
  "dictation": [
    {
      "id": "uuid",
      "audio": "https://example.com/audio/dictation1.mp3",
      "correct_answer": "The weather is nice today"
    }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "dictation",
  "question_text": "Listen and type what you hear",
  "order_number": 8,
  "points": 15,
  "dictation": {
    "audio": "https://example.com/audio/dictation1.mp3",
    "correct_answer": "The weather is nice today"
  }
}
```

---

### 4.9 Listen and Choose

User listens to audio and selects the correct option from a list.

**Response data:**
```json
{
  "question_type": "listen_and_choose",
  "question_text": "Listen and choose the correct word",
  "listen_and_choose": [
    {
      "id": "uuid",
      "audio": "https://example.com/audio/word1.mp3",
      "options": [
        { "text": "apple", "is_correct": true },
        { "text": "orange", "is_correct": false },
        { "text": "banana", "is_correct": false }
      ]
    }
  ]
}
```

**Create payload:**
```json
{
  "question_type": "listen_and_choose",
  "question_text": "Listen and choose the correct word",
  "order_number": 9,
  "points": 10,
  "listen_and_choose": {
    "audio": "https://example.com/audio/word1.mp3",
    "options": [
      { "text": "apple", "is_correct": true },
      { "text": "orange", "is_correct": false },
      { "text": "banana", "is_correct": false }
    ]
  }
}
```

---

## 5. Full Create Exercise Example

```http
POST /exercise
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

```json
{
  "title": "Lesson 5 - Mixed Exercise",
  "exercise_type": "grammar",
  "instructions": "Complete all the questions below",
  "lessonId": "123e4567-e89b-12d3-a456-426614174000",
  "questions": [
    {
      "question_type": "multiple_choice",
      "question_text": "She ___ to school every day.",
      "order_number": 1,
      "points": 10,
      "choices": [
        { "option_text": "goes", "is_correct": true },
        { "option_text": "go", "is_correct": false },
        { "option_text": "going", "is_correct": false }
      ]
    },
    {
      "question_type": "translation",
      "question_text": "Translate this sentence",
      "order_number": 2,
      "points": 10,
      "translation": {
        "given_text": "I like reading books",
        "correct_answer": "Men kitob o'qishni yaxshi ko'raman"
      }
    },
    {
      "question_type": "dictation",
      "question_text": "Listen and write",
      "order_number": 3,
      "points": 15,
      "dictation": {
        "audio": "https://cdn.example.com/audio/lesson5-q3.mp3",
        "correct_answer": "The weather is nice today"
      }
    },
    {
      "question_type": "listen_and_choose",
      "question_text": "What word do you hear?",
      "order_number": 4,
      "points": 10,
      "listen_and_choose": {
        "audio": "https://cdn.example.com/audio/lesson5-q4.mp3",
        "options": [
          { "text": "beach", "is_correct": true },
          { "text": "peach", "is_correct": false },
          { "text": "reach", "is_correct": false }
        ]
      }
    }
  ]
}
```

---

## 6. TypeScript Interfaces (Frontend / Expo)

```typescript
// ---- Enums ----

type ExerciseType = 'grammar' | 'reading' | 'listening' | 'writing';

type QuestionType =
  | 'multiple_choice'
  | 'fill_in_the_blank'
  | 'true_false'
  | 'short_answer'
  | 'matching'
  | 'sentence_build'
  | 'translation'
  | 'dictation'
  | 'listen_and_choose';

// ---- Nested Data Types ----

interface Choice {
  id: string;
  option_text: string;
  is_correct: boolean;
}

interface GapFilling {
  id: string;
  gap_number: number;
  correct_answer: string[];
}

interface MatchingPair {
  id: string;
  left_item: string;
  right_item: string;
}

interface TypingExercise {
  id: string;
  correct_answer: string;
  is_case_sensitive: boolean;
}

interface SentenceBuild {
  id: string;
  given_text: string;
  correct_answer: string;
}

interface Translation {
  id: string;
  given_text: string;
  correct_answer: string;
}

interface Dictation {
  id: string;
  audio: string;
  correct_answer: string;
}

interface ListenAndChooseOption {
  text: string;
  is_correct: boolean;
}

interface ListenAndChoose {
  id: string;
  audio: string;
  options: ListenAndChooseOption[];
}

// ---- Question ----

interface Question {
  id: string;
  exercise_id: string;
  question_type: QuestionType;
  question_text: string;
  points: number | null;
  order_number: number;
  sample_answer: string | null;
  choices: Choice[];
  gap_filling: GapFilling[];
  matching_pairs: MatchingPair[];
  typing_exercise: TypingExercise | null;
  sentence_build: SentenceBuild[];
  translation: Translation[];
  dictation: Dictation[];
  listen_and_choose: ListenAndChoose[];
}

// ---- Exercise ----

interface Exercise {
  id: string;
  title: string;
  exercise_type: ExerciseType;
  audio_url: string | null;
  image_url: string | null;
  video_url: string | null;
  instructions: string | null;
  content: string | null;
  isActive: boolean;
  lessonId: string | null;
  questions: Question[];
  // Present when fetched via type + lesson with student context
  isCompleted?: boolean;
  score?: number | null;
}
```

---

## 7. Expo / React Native Rendering Guide

### 7.1 Question Renderer Pattern

Use a switch-based renderer to display each question type:

```tsx
import React from 'react';
import { View, Text } from 'react-native';

function QuestionRenderer({ question }: { question: Question }) {
  switch (question.question_type) {
    case 'multiple_choice':
    case 'true_false':
      return <MultipleChoiceQuestion question={question} />;
    case 'fill_in_the_blank':
      return <FillInBlankQuestion question={question} />;
    case 'matching':
      return <MatchingQuestion question={question} />;
    case 'short_answer':
      return <ShortAnswerQuestion question={question} />;
    case 'sentence_build':
      return <SentenceBuildQuestion question={question} />;
    case 'translation':
      return <TranslationQuestion question={question} />;
    case 'dictation':
      return <DictationQuestion question={question} />;
    case 'listen_and_choose':
      return <ListenAndChooseQuestion question={question} />;
    default:
      return <Text>Unknown question type</Text>;
  }
}
```

### 7.2 Dictation Component Example

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

function DictationQuestion({ question }: { question: Question }) {
  const [answer, setAnswer] = useState('');
  const dictation = question.dictation[0];

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: dictation.audio });
    await sound.playAsync();
  };

  return (
    <View>
      <Text>{question.question_text}</Text>
      <TouchableOpacity onPress={playAudio}>
        <Text>🔊 Play Audio</Text>
      </TouchableOpacity>
      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Type what you hear..."
        multiline
      />
    </View>
  );
}
```

### 7.3 Listen and Choose Component Example

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

function ListenAndChooseQuestion({ question }: { question: Question }) {
  const [selected, setSelected] = useState<string | null>(null);
  const data = question.listen_and_choose[0];

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: data.audio });
    await sound.playAsync();
  };

  return (
    <View>
      <Text>{question.question_text}</Text>
      <TouchableOpacity onPress={playAudio}>
        <Text>🔊 Play Audio</Text>
      </TouchableOpacity>
      {data.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelected(option.text)}
          style={{
            padding: 12,
            marginVertical: 4,
            borderRadius: 8,
            backgroundColor: selected === option.text ? '#4A90D9' : '#f0f0f0',
          }}
        >
          <Text style={{ color: selected === option.text ? '#fff' : '#333' }}>
            {option.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### 7.4 Translation Component Example

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

function TranslationQuestion({ question }: { question: Question }) {
  const [answer, setAnswer] = useState('');
  const data = question.translation[0];

  return (
    <View>
      <Text>{question.question_text}</Text>
      <View style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, marginVertical: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{data.given_text}</Text>
      </View>
      <TextInput
        value={answer}
        onChangeText={setAnswer}
        placeholder="Type your translation..."
        multiline
      />
    </View>
  );
}
```

### 7.5 Sentence Build Component Example

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function SentenceBuildQuestion({ question }: { question: Question }) {
  const data = question.sentence_build[0];
  const words = data.given_text.split(' ');
  const [selected, setSelected] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(words);

  const selectWord = (word: string, index: number) => {
    setSelected([...selected, word]);
    setRemaining(remaining.filter((_, i) => i !== index));
  };

  const removeWord = (index: number) => {
    const word = selected[index];
    setRemaining([...remaining, word]);
    setSelected(selected.filter((_, i) => i !== index));
  };

  return (
    <View>
      <Text>{question.question_text}</Text>

      {/* Selected words (answer area) */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 50, padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginVertical: 8 }}>
        {selected.map((word, i) => (
          <TouchableOpacity key={i} onPress={() => removeWord(i)} style={{ padding: 8, margin: 4, backgroundColor: '#4A90D9', borderRadius: 6 }}>
            <Text style={{ color: '#fff' }}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Available words */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {remaining.map((word, i) => (
          <TouchableOpacity key={i} onPress={() => selectWord(word, i)} style={{ padding: 8, margin: 4, backgroundColor: '#e0e0e0', borderRadius: 6 }}>
            <Text>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
```

---

## 8. Answer Checking (Client-Side)

```typescript
function checkAnswer(question: Question, userAnswer: any): boolean {
  switch (question.question_type) {
    case 'multiple_choice':
    case 'true_false': {
      const correct = question.choices.find(c => c.is_correct);
      return correct?.id === userAnswer;
    }
    case 'fill_in_the_blank': {
      // userAnswer: Record<number, string> — gap_number → user input
      return question.gap_filling.every(gap =>
        gap.correct_answer.some(
          ans => ans.toLowerCase() === (userAnswer[gap.gap_number] || '').toLowerCase()
        )
      );
    }
    case 'short_answer': {
      const typing = question.typing_exercise;
      if (!typing) return false;
      return typing.is_case_sensitive
        ? userAnswer === typing.correct_answer
        : userAnswer.toLowerCase() === typing.correct_answer.toLowerCase();
    }
    case 'sentence_build': {
      const sb = question.sentence_build[0];
      return userAnswer.trim().toLowerCase() === sb.correct_answer.trim().toLowerCase();
    }
    case 'translation': {
      const tr = question.translation[0];
      return userAnswer.trim().toLowerCase() === tr.correct_answer.trim().toLowerCase();
    }
    case 'dictation': {
      const d = question.dictation[0];
      return userAnswer.trim().toLowerCase() === d.correct_answer.trim().toLowerCase();
    }
    case 'listen_and_choose': {
      const lac = question.listen_and_choose[0];
      const correct = lac.options.find(o => o.is_correct);
      return correct?.text === userAnswer;
    }
    case 'matching': {
      // userAnswer: { left: string, right: string }[]
      return question.matching_pairs.every(pair =>
        userAnswer.some(
          (a: any) => a.left === pair.left_item && a.right === pair.right_item
        )
      );
    }
    default:
      return false;
  }
}
```

---

## 9. Fetching Exercises (API Helper)

```typescript
const API_BASE = 'https://your-api.com';

async function fetchExercisesByLesson(
  lessonId: string,
  exerciseType: string,
  token: string
): Promise<Exercise[]> {
  const res = await fetch(
    `${API_BASE}/exercise/type/${exerciseType}/lesson/${lessonId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch exercises');
  return res.json();
}

async function fetchExercise(id: string, token: string): Promise<Exercise> {
  const res = await fetch(`${API_BASE}/exercise/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Exercise not found');
  return res.json();
}

async function createExercise(data: any, token: string): Promise<Exercise> {
  const res = await fetch(`${API_BASE}/exercise`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create exercise');
  return res.json();
}
```

---

## 10. Notes

- When creating, `sentence_build`, `translation`, `dictation`, and `listen_and_choose` accept a **single object** or an **array** of objects.
- `choices` is shared between `multiple_choice` and `true_false` question types.
- The `GET /exercise/type/:type/lesson/:lessonId` endpoint automatically includes `isCompleted` and `score` for the authenticated student.
- Questions are always returned ordered by `order_number` ASC.
- Audio fields (`audio` in dictation / listen_and_choose) should contain full URLs to audio files.
- For Expo audio playback, use `expo-av` (`Audio.Sound`).
