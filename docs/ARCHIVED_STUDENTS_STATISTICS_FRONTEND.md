# Archived Students Statistics — Nuxt 4 Frontend Integration Guide

> **Base path:** `/users/archived-students`  
> **Auth:** `Authorization: Bearer <JWT_TOKEN>` (required)  
> **Roles:** `ADMIN` only

---

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoint](#2-api-endpoint)
3. [TypeScript Types](#3-typescript-types)
4. [Nuxt 4 — Composable](#4-nuxt-4--composable)
5. [Page Examples](#5-page-examples)
   - [Statistics Dashboard](#51-statistics-dashboard)
   - [Reason Breakdown Chart](#52-reason-breakdown-chart)
   - [Teacher Leaderboard](#53-teacher-leaderboard)
6. [Filterable Date Range Component](#6-filterable-date-range-component)
7. [Reason Labels (Uzbek → UI)](#7-reason-labels-uzbek--ui)

---

## 1. Overview

The statistics endpoint gives a comprehensive snapshot of **why** and **when** students leave, broken down by reason, teacher, group, and monthly trends. Use this to build admin dashboards for tracking student retention.

### Key metrics returned

| Metric | Description |
|--------|-------------|
| `totalArchived` | Lifetime total of archived students (filtered) |
| `periodStats.today` | Archives created today |
| `periodStats.thisWeek` | Archives this week (Sun–Sat) |
| `periodStats.thisMonth` | Archives this calendar month |
| `periodStats.lastMonth` | Archives last calendar month |
| `periodStats.monthOverMonthChange` | % change current vs previous month |
| `byReason` | Count per `ArchivedStudentReason` |
| `monthlyTrend` | Last 12 months (year-month + count) |
| `byTeacher` | Top 10 teachers losing students |
| `byGroup` | Top 10 groups losing students |

---

## 2. API Endpoint

### `GET /users/archived-students/statistics`

```http
GET /users/archived-students/statistics?startDate=2025-01-01&endDate=2025-12-31&teacher_id=<UUID>&group_id=<UUID>
Authorization: Bearer <TOKEN>
```

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | ISO date string | No | Filter archives created ≥ this date |
| `endDate` | ISO date string | No | Filter archives created ≤ this date |
| `teacher_id` | UUID string | No | Filter by teacher |
| `group_id` | UUID string | No | Filter by group |

### Response

```json
{
  "totalArchived": 156,
  "periodStats": {
    "today": 2,
    "thisWeek": 8,
    "thisMonth": 23,
    "lastMonth": 19,
    "monthOverMonthChange": 21
  },
  "byReason": [
    { "reason": "Narxning qimmatligi", "count": 42 },
    { "reason": "Dars o'tilish usuli yoqmaganligi", "count": 18 },
    { "reason": "Guruhdagi muhit (guruh o'quvchilari)", "count": 12 },
    { "reason": "Guruh darajasi to'g'ri kelmaganligi", "count": 9 },
    { "reason": "Ustozning tashqi ko'rishni va munosabati", "count": 7 },
    { "reason": "Markazning joylashuvi noqulayligi", "count": 15 },
    { "reason": "O'quvchining shaxsiy muammolari tufayli (sog'ligi yoki boshqa)", "count": 22 },
    { "reason": "Kursni muvaffaqiyatli tugatdi", "count": 20 },
    { "reason": "Boshqa", "count": 11 }
  ],
  "monthlyTrend": [
    { "month": "2025-04", "count": 14 },
    { "month": "2025-05", "count": 18 },
    { "month": "2025-06", "count": 10 }
  ],
  "byTeacher": [
    {
      "teacher_id": "uuid",
      "count": 12,
      "teacher": {
        "user_id": "uuid",
        "first_name": "Aziz",
        "last_name": "Karimov"
      }
    }
  ],
  "byGroup": [
    {
      "group_id": "uuid",
      "count": 8,
      "group": {
        "id": "uuid",
        "name": "Advanced English B2"
      }
    }
  ]
}
```

---

## 3. TypeScript Types

```ts
// ~/types/archived-student.ts

/** Reason enum values (from backend ArchivedStudentReason) */
export type ArchivedStudentReason =
  | 'Narxning qimmatligi'
  | "Dars o'tilish usuli yoqmaganligi"
  | "Guruhdagi muhit (guruh o'quvchilari)"
  | "Guruh darajasi to'g'ri kelmaganligi"
  | "Ustozning tashqi ko'rishni va munosabati"
  | 'Markazning joylashuvi noqulayligi'
  | "O'quvchining shaxsiy muammolari tufayli (sog'ligi yoki boshqa)"
  | 'Kursni muvaffaqiyatli tugatdi'
  | 'Boshqa'

export interface ArchivedStudent {
  id: string
  user_id: string
  reason: ArchivedStudentReason
  teacher_id: string | null
  group_id: string | null
  notes: string | null
  created_at: string
  student?: { user_id: string; first_name: string; last_name: string; phone: string; avatar_url: string | null }
  teacher?: { user_id: string; first_name: string; last_name: string }
  group?: { id: string; name: string }
}

export interface ArchivedStudentListResponse {
  data: ArchivedStudent[]
  total: number
  page: number
  limit: number
}

export interface ReasonCount {
  reason: ArchivedStudentReason
  count: number
}

export interface MonthlyTrendItem {
  month: string       // "2025-06"
  count: number
}

export interface TeacherArchiveCount {
  teacher_id: string
  count: number
  teacher: { user_id: string; first_name: string; last_name: string }
}

export interface GroupArchiveCount {
  group_id: string
  count: number
  group: { id: string; name: string }
}

export interface PeriodStats {
  today: number
  thisWeek: number
  thisMonth: number
  lastMonth: number
  monthOverMonthChange: number   // percentage
}

export interface ArchivedStudentStatistics {
  totalArchived: number
  periodStats: PeriodStats
  byReason: ReasonCount[]
  monthlyTrend: MonthlyTrendItem[]
  byTeacher: TeacherArchiveCount[]
  byGroup: GroupArchiveCount[]
}

export interface ArchivedStudentStatisticsQuery {
  startDate?: string
  endDate?: string
  teacher_id?: string
  group_id?: string
}
```

---

## 4. Nuxt 4 — Composable

### `composables/useArchivedStudents.ts`

```ts
import type {
  ArchivedStudent,
  ArchivedStudentListResponse,
  ArchivedStudentStatistics,
  ArchivedStudentStatisticsQuery,
} from '~/types/archived-student'

export const useArchivedStudents = () => {
  const { apiFetch } = useApi()

  // ── List (paginated) ─────────────────────────────────────────────────────
  const fetchArchivedStudents = (query: {
    page?: number
    limit?: number
    reason?: string
  } = {}) =>
    apiFetch<ArchivedStudentListResponse>('/users/archived-students', {
      query,
    })

  // ── Statistics ───────────────────────────────────────────────────────────
  const fetchStatistics = (query: ArchivedStudentStatisticsQuery = {}) =>
    apiFetch<ArchivedStudentStatistics>(
      '/users/archived-students/statistics',
      { query },
    )

  // ── Single ───────────────────────────────────────────────────────────────
  const fetchOne = (id: string) =>
    apiFetch<ArchivedStudent>(`/users/archived-students/${id}`)

  // ── Create (archive a student) ───────────────────────────────────────────
  const archiveStudent = (body: {
    user_id: string
    reason: string
    notes?: string
  }) =>
    apiFetch<ArchivedStudent>('/users/archived-students', {
      method: 'POST',
      body,
    })

  // ── Delete record ────────────────────────────────────────────────────────
  const deleteArchivedStudent = (id: string) =>
    apiFetch(`/users/archived-students/${id}`, { method: 'DELETE' })

  return {
    fetchArchivedStudents,
    fetchStatistics,
    fetchOne,
    archiveStudent,
    deleteArchivedStudent,
  }
}
```

---

## 5. Page Examples

### 5.1 Statistics Dashboard

```vue
<!-- pages/admin/archived-students/statistics.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchStatistics } = useArchivedStudents()

const startDate = ref('')
const endDate = ref('')
const teacherId = ref('')
const groupId = ref('')

const queryParams = computed(() => ({
  ...(startDate.value ? { startDate: startDate.value } : {}),
  ...(endDate.value ? { endDate: endDate.value } : {}),
  ...(teacherId.value ? { teacher_id: teacherId.value } : {}),
  ...(groupId.value ? { group_id: groupId.value } : {}),
}))

const { data: stats, pending, refresh } = await useAsyncData(
  'archived-student-stats',
  () => fetchStatistics(queryParams.value),
  { watch: [queryParams] },
)
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Arxivlangan o'quvchilar statistikasi</h1>

    <!-- Filters -->
    <div class="flex gap-4 flex-wrap">
      <input v-model="startDate" type="date" class="border rounded px-3 py-2" placeholder="Boshlanish" />
      <input v-model="endDate" type="date" class="border rounded px-3 py-2" placeholder="Tugash" />
    </div>

    <p v-if="pending">Yuklanmoqda…</p>

    <template v-else-if="stats">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <p class="text-sm text-gray-500">Jami</p>
          <p class="text-3xl font-bold">{{ stats.totalArchived }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <p class="text-sm text-gray-500">Bugun</p>
          <p class="text-3xl font-bold">{{ stats.periodStats.today }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <p class="text-sm text-gray-500">Bu hafta</p>
          <p class="text-3xl font-bold">{{ stats.periodStats.thisWeek }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <p class="text-sm text-gray-500">Bu oy</p>
          <p class="text-3xl font-bold">{{ stats.periodStats.thisMonth }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4 text-center">
          <p class="text-sm text-gray-500">O'tgan oy</p>
          <p class="text-3xl font-bold">{{ stats.periodStats.lastMonth }}</p>
          <p
            class="text-sm mt-1"
            :class="stats.periodStats.monthOverMonthChange > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{ stats.periodStats.monthOverMonthChange > 0 ? '+' : '' }}{{ stats.periodStats.monthOverMonthChange }}%
          </p>
        </div>
      </div>

      <!-- Reason Breakdown Table -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Sabablar bo'yicha</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2">Sabab</th>
              <th class="py-2 text-right">Soni</th>
              <th class="py-2 text-right">Ulushi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in stats.byReason" :key="r.reason" class="border-b">
              <td class="py-2">{{ r.reason }}</td>
              <td class="py-2 text-right">{{ r.count }}</td>
              <td class="py-2 text-right">
                {{ stats.totalArchived > 0 ? Math.round((r.count / stats.totalArchived) * 100) : 0 }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Monthly Trend -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Oylik trend (oxirgi 12 oy)</h2>
        <div class="flex items-end gap-2 h-48">
          <div
            v-for="m in stats.monthlyTrend"
            :key="m.month"
            class="flex-1 flex flex-col items-center justify-end"
          >
            <span class="text-xs mb-1">{{ m.count }}</span>
            <div
              class="w-full bg-blue-500 rounded-t"
              :style="{
                height: `${Math.max(
                  (m.count / Math.max(...stats.monthlyTrend.map(t => t.count), 1)) * 100,
                  4,
                )}%`,
              }"
            />
            <span class="text-xs mt-1 text-gray-500">{{ m.month.slice(5) }}</span>
          </div>
        </div>
      </div>

      <!-- Top Teachers -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">O'qituvchilar bo'yicha (top 10)</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2">#</th>
              <th class="py-2">O'qituvchi</th>
              <th class="py-2 text-right">Soni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, i) in stats.byTeacher" :key="t.teacher_id" class="border-b">
              <td class="py-2">{{ i + 1 }}</td>
              <td class="py-2">{{ t.teacher.first_name }} {{ t.teacher.last_name }}</td>
              <td class="py-2 text-right">{{ t.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Top Groups -->
      <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Guruhlar bo'yicha (top 10)</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2">#</th>
              <th class="py-2">Guruh</th>
              <th class="py-2 text-right">Soni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(g, i) in stats.byGroup" :key="g.group_id" class="border-b">
              <td class="py-2">{{ i + 1 }}</td>
              <td class="py-2">{{ g.group.name }}</td>
              <td class="py-2 text-right">{{ g.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
```

---

### 5.2 Reason Breakdown Chart

Using **Chart.js** with `vue-chartjs`:

```vue
<!-- components/ArchivedReasonChart.vue -->
<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ReasonCount } from '~/types/archived-student'
import { REASON_LABELS } from '~/utils/archived-student-reasons'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{ reasons: ReasonCount[] }>()

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
]

const chartData = computed(() => ({
  labels: props.reasons.map(r => REASON_LABELS[r.reason] ?? r.reason),
  datasets: [
    {
      data: props.reasons.map(r => r.count),
      backgroundColor: COLORS.slice(0, props.reasons.length),
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' as const },
  },
}
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
```

Usage:

```vue
<ArchivedReasonChart :reasons="stats.byReason" />
```

---

### 5.3 Teacher Leaderboard

```vue
<!-- components/ArchivedByTeacherCard.vue -->
<script setup lang="ts">
import type { TeacherArchiveCount } from '~/types/archived-student'

defineProps<{
  teachers: TeacherArchiveCount[]
  total: number
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h3 class="font-semibold text-lg mb-4">O'qituvchilar reytingi</h3>

    <div v-for="(t, i) in teachers" :key="t.teacher_id" class="flex items-center gap-3 py-2">
      <span class="text-gray-400 w-6 text-right">{{ i + 1 }}</span>
      <div class="flex-1">
        <p class="font-medium">{{ t.teacher.first_name }} {{ t.teacher.last_name }}</p>
        <div class="w-full bg-gray-100 rounded-full h-2 mt-1">
          <div
            class="bg-red-500 h-2 rounded-full"
            :style="{ width: `${total > 0 ? (t.count / total) * 100 : 0}%` }"
          />
        </div>
      </div>
      <span class="font-bold text-red-600">{{ t.count }}</span>
    </div>
  </div>
</template>
```

Usage:

```vue
<ArchivedByTeacherCard :teachers="stats.byTeacher" :total="stats.totalArchived" />
```

---

## 6. Filterable Date Range Component

```vue
<!-- components/DateRangeFilter.vue -->
<script setup lang="ts">
const startDate = defineModel<string>('startDate', { default: '' })
const endDate = defineModel<string>('endDate', { default: '' })

const emit = defineEmits<{ clear: [] }>()

const presets = [
  { label: 'Bu oy', start: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10), end: () => '' },
  { label: 'O\'tgan oy', start: () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 10), end: () => new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().slice(0, 10) },
  { label: 'Oxirgi 3 oy', start: () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10) }, end: () => '' },
  { label: 'Bu yil', start: () => `${new Date().getFullYear()}-01-01`, end: () => '' },
]

function applyPreset(preset: typeof presets[number]) {
  startDate.value = preset.start()
  endDate.value = preset.end()
}

function clear() {
  startDate.value = ''
  endDate.value = ''
  emit('clear')
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <input v-model="startDate" type="date" class="border rounded px-3 py-2 text-sm" />
    <span class="text-gray-400">—</span>
    <input v-model="endDate" type="date" class="border rounded px-3 py-2 text-sm" />

    <div class="flex gap-1">
      <button
        v-for="p in presets"
        :key="p.label"
        class="px-3 py-1.5 text-xs rounded-full border hover:bg-gray-100"
        @click="applyPreset(p)"
      >
        {{ p.label }}
      </button>
    </div>

    <button class="text-xs text-gray-400 underline" @click="clear">Tozalash</button>
  </div>
</template>
```

Usage in the statistics page:

```vue
<DateRangeFilter v-model:start-date="startDate" v-model:end-date="endDate" />
```

---

## 7. Reason Labels (Uzbek → UI)

Helper map for shorter/translated labels in charts and tables:

```ts
// utils/archived-student-reasons.ts
import type { ArchivedStudentReason } from '~/types/archived-student'

export const REASON_LABELS: Record<ArchivedStudentReason, string> = {
  'Narxning qimmatligi': 'Narx qimmat',
  "Dars o'tilish usuli yoqmaganligi": "Dars usuli yoqmadi",
  'Guruhdagi muhit (guruh o\'quvchilari)': 'Guruh muhiti',
  "Guruh darajasi to'g'ri kelmaganligi": 'Daraja mos emas',
  "Ustozning tashqi ko'rishni va munosabati": 'Ustoz munosabati',
  'Markazning joylashuvi noqulayligi': 'Joylashuv noqulay',
  "O'quvchining shaxsiy muammolari tufayli (sog'ligi yoki boshqa)": 'Shaxsiy sabab',
  'Kursni muvaffaqiyatli tugatdi': 'Kursni tugatdi ✅',
  'Boshqa': 'Boshqa',
}

/** Color for reason (good for charts) */
export const REASON_COLORS: Record<ArchivedStudentReason, string> = {
  'Narxning qimmatligi': '#ef4444',
  "Dars o'tilish usuli yoqmaganligi": '#f97316',
  'Guruhdagi muhit (guruh o\'quvchilari)': '#eab308',
  "Guruh darajasi to'g'ri kelmaganligi": '#a855f7',
  "Ustozning tashqi ko'rishni va munosabati": '#ec4899',
  'Markazning joylashuvi noqulayligi': '#06b6d4',
  "O'quvchining shaxsiy muammolari tufayli (sog'ligi yoki boshqa)": '#6b7280',
  'Kursni muvaffaqiyatli tugatdi': '#22c55e',
  'Boshqa': '#94a3b8',
}
```
