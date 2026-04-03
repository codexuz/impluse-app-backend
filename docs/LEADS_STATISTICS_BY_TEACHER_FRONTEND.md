# Leads Statistics by Teacher — Nuxt 4 Frontend Integration Guide

> **Base path:** `/lead-trial-lessons`  
> **Auth:** `Authorization: Bearer <JWT_TOKEN>` (required)  
> **Roles:** `ADMIN` only

---

## Table of Contents

1. [Overview](#1-overview)
2. [API Endpoint](#2-api-endpoint)
3. [TypeScript Types](#3-typescript-types)
4. [Nuxt 4 — Composable](#4-nuxt-4--composable)
5. [Page Examples](#5-page-examples)
   - [Teacher Performance Dashboard](#51-teacher-performance-dashboard)
   - [Conversion Funnel Chart](#52-conversion-funnel-chart)
   - [Single Teacher Detail Card](#53-single-teacher-detail-card)
6. [Reusable Components](#6-reusable-components)
   - [Date Range Filter](#61-date-range-filter)
   - [Stat Card](#62-stat-card)
   - [Conversion Bar](#63-conversion-bar)
7. [Status Labels & Colors](#7-status-labels--colors)

---

## 1. Overview

This endpoint answers three questions per teacher:

| Question | Metric |
|----------|--------|
| How many leads were **assigned** to trial lessons? | `totalAssigned` |
| How many leads **became students**? | `becameStudent` (lead status = "O'qishga yozildi") |
| How many leads were **lost**? | `lost` (lead status = "Yo'qotildi") |

Additionally tracks trial lesson attendance (`keldi` / `kelmadi` / `belgilangan`) and overall conversion rate.

### Data Flow

```
Lead created → Trial lesson assigned to teacher → Student attends/doesn't attend
                                                      ↓
                                         Lead status updated:
                                         ✅ "O'qishga yozildi" (became student)
                                         ❌ "Yo'qotildi" (lost)
                                         ⏳ Other statuses (in progress)
```

---

## 2. API Endpoint

### `GET /lead-trial-lessons/leads-statistics`

```http
GET /lead-trial-lessons/leads-statistics?startDate=2025-01-01&endDate=2025-12-31&teacher_id=<UUID>
Authorization: Bearer <TOKEN>
```

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | ISO date string | No | Filter trial lessons created ≥ this date |
| `endDate` | ISO date string | No | Filter trial lessons created ≤ this date |
| `teacher_id` | UUID string | No | Filter by specific teacher |

### Response

```json
{
  "summary": {
    "totalAssigned": 120,
    "totalAttended": 85,
    "totalNotAttended": 20,
    "totalBecameStudent": 52,
    "totalLost": 30,
    "totalInProgress": 38,
    "overallConversionRate": 43
  },
  "teachers": [
    {
      "teacher_id": "550e8400-e29b-41d4-a716-446655440001",
      "teacherName": "Aziz Karimov",
      "totalAssigned": 25,
      "attended": 18,
      "notAttended": 4,
      "pending": 3,
      "becameStudent": 12,
      "lost": 6,
      "inProgress": 7,
      "conversionRate": 48,
      "leads": [
        {
          "lead_id": "550e8400-e29b-41d4-a716-446655440099",
          "leadName": "Ali Valiyev",
          "trialStatus": "keldi",
          "leadStatus": "O'qishga yozildi"
        }
      ]
    }
  ]
}
```

---

## 3. TypeScript Types

```ts
// ~/types/leads-statistics.ts

export interface LeadDetail {
  lead_id: string
  leadName: string
  trialStatus: 'belgilangan' | 'keldi' | 'kelmadi'
  leadStatus: string
}

export interface TeacherLeadStats {
  teacher_id: string
  teacherName: string
  totalAssigned: number
  attended: number
  notAttended: number
  pending: number
  becameStudent: number
  lost: number
  inProgress: number
  conversionRate: number   // percentage 0–100
  leads: LeadDetail[]
}

export interface LeadsStatisticsSummary {
  totalAssigned: number
  totalAttended: number
  totalNotAttended: number
  totalBecameStudent: number
  totalLost: number
  totalInProgress: number
  overallConversionRate: number   // percentage 0–100
}

export interface LeadsStatisticsResponse {
  summary: LeadsStatisticsSummary
  teachers: TeacherLeadStats[]
}

export interface LeadsStatisticsQuery {
  startDate?: string
  endDate?: string
  teacher_id?: string
}
```

---

## 4. Nuxt 4 — Composable

### Prerequisites: `composables/useApi.ts`

```ts
// composables/useApi.ts  (shared — skip if already exists)
export const useApi = () => {
  const config = useRuntimeConfig()
  const token = useCookie('access_token')

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    headers: {
      Authorization: `Bearer ${token.value ?? ''}`,
    },
  })

  return { apiFetch }
}
```

### `composables/useLeadsStatistics.ts`

```ts
import type {
  LeadsStatisticsResponse,
  LeadsStatisticsQuery,
} from '~/types/leads-statistics'

export const useLeadsStatistics = () => {
  const { apiFetch } = useApi()

  const fetchLeadsStatistics = (query: LeadsStatisticsQuery = {}) =>
    apiFetch<LeadsStatisticsResponse>(
      '/lead-trial-lessons/leads-statistics',
      { query },
    )

  return { fetchLeadsStatistics }
}
```

---

## 5. Page Examples

### 5.1 Teacher Performance Dashboard

```vue
<!-- pages/admin/leads-statistics.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchLeadsStatistics } = useLeadsStatistics()

const startDate = ref('')
const endDate = ref('')
const teacherId = ref('')

const queryParams = computed(() => ({
  ...(startDate.value ? { startDate: startDate.value } : {}),
  ...(endDate.value ? { endDate: endDate.value } : {}),
  ...(teacherId.value ? { teacher_id: teacherId.value } : {}),
}))

const { data: stats, pending, refresh } = await useAsyncData(
  'leads-statistics',
  () => fetchLeadsStatistics(queryParams.value),
  { watch: [queryParams] },
)

// Expanded teacher rows
const expandedTeacherId = ref<string | null>(null)

function toggleExpand(id: string) {
  expandedTeacherId.value = expandedTeacherId.value === id ? null : id
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">O'qituvchilar bo'yicha lidlar statistikasi</h1>

    <!-- Filters -->
    <div class="flex gap-4 flex-wrap items-end">
      <div>
        <label class="text-sm text-gray-500">Boshlanish</label>
        <input v-model="startDate" type="date" class="block border rounded px-3 py-2" />
      </div>
      <div>
        <label class="text-sm text-gray-500">Tugash</label>
        <input v-model="endDate" type="date" class="block border rounded px-3 py-2" />
      </div>
      <button
        class="text-sm text-gray-400 underline self-end pb-2"
        @click="startDate = ''; endDate = ''; teacherId = ''"
      >
        Tozalash
      </button>
    </div>

    <p v-if="pending">Yuklanmoqda…</p>

    <template v-else-if="stats">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard label="Jami tayinlangan" :value="stats.summary.totalAssigned" color="blue" />
        <StatCard label="Keldi" :value="stats.summary.totalAttended" color="green" />
        <StatCard label="Kelmadi" :value="stats.summary.totalNotAttended" color="red" />
        <StatCard label="O'quvchi bo'ldi" :value="stats.summary.totalBecameStudent" color="emerald" />
        <StatCard label="Yo'qotildi" :value="stats.summary.totalLost" color="rose" />
        <StatCard label="Jarayonda" :value="stats.summary.totalInProgress" color="amber" />
        <StatCard
          label="Konversiya"
          :value="`${stats.summary.overallConversionRate}%`"
          color="indigo"
        />
      </div>

      <!-- Teacher Table -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">O'qituvchi</th>
              <th class="px-4 py-3 text-center">Tayinlangan</th>
              <th class="px-4 py-3 text-center">Keldi</th>
              <th class="px-4 py-3 text-center">Kelmadi</th>
              <th class="px-4 py-3 text-center text-emerald-600">O'quvchi bo'ldi</th>
              <th class="px-4 py-3 text-center text-rose-600">Yo'qotildi</th>
              <th class="px-4 py-3 text-center">Jarayonda</th>
              <th class="px-4 py-3 text-center">Konversiya</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(t, i) in stats.teachers" :key="t.teacher_id">
              <tr class="border-b hover:bg-gray-50 cursor-pointer" @click="toggleExpand(t.teacher_id)">
                <td class="px-4 py-3">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ t.teacherName }}</td>
                <td class="px-4 py-3 text-center">{{ t.totalAssigned }}</td>
                <td class="px-4 py-3 text-center text-green-600">{{ t.attended }}</td>
                <td class="px-4 py-3 text-center text-red-500">{{ t.notAttended }}</td>
                <td class="px-4 py-3 text-center font-semibold text-emerald-600">{{ t.becameStudent }}</td>
                <td class="px-4 py-3 text-center font-semibold text-rose-600">{{ t.lost }}</td>
                <td class="px-4 py-3 text-center text-amber-600">{{ t.inProgress }}</td>
                <td class="px-4 py-3 text-center">
                  <ConversionBar :rate="t.conversionRate" />
                </td>
                <td class="px-4 py-3 text-gray-400">
                  {{ expandedTeacherId === t.teacher_id ? '▲' : '▼' }}
                </td>
              </tr>

              <!-- Expanded Leads Detail -->
              <tr v-if="expandedTeacherId === t.teacher_id">
                <td colspan="10" class="bg-gray-50 px-6 py-4">
                  <p class="text-xs text-gray-400 mb-2">Lidlar ro'yxati ({{ t.leads.length }})</p>
                  <table class="w-full text-xs">
                    <thead>
                      <tr class="text-gray-500">
                        <th class="text-left py-1">Lid ismi</th>
                        <th class="text-center py-1">Sinov darsi</th>
                        <th class="text-center py-1">Holati</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="lead in t.leads" :key="lead.lead_id" class="border-t border-gray-100">
                        <td class="py-1">{{ lead.leadName }}</td>
                        <td class="py-1 text-center">
                          <span
                            class="px-2 py-0.5 rounded-full text-xs"
                            :class="TRIAL_STATUS_CLASSES[lead.trialStatus]"
                          >
                            {{ TRIAL_STATUS_LABELS[lead.trialStatus] }}
                          </span>
                        </td>
                        <td class="py-1 text-center">
                          <span
                            class="px-2 py-0.5 rounded-full text-xs"
                            :class="LEAD_STATUS_CLASSES[lead.leadStatus] ?? 'bg-gray-100 text-gray-600'"
                          >
                            {{ lead.leadStatus || '—' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
// Status label/color maps (can also be in ~/utils/lead-status.ts)
const TRIAL_STATUS_LABELS: Record<string, string> = {
  belgilangan: 'Belgilangan',
  keldi: 'Keldi',
  kelmadi: 'Kelmadi',
}

const TRIAL_STATUS_CLASSES: Record<string, string> = {
  belgilangan: 'bg-blue-100 text-blue-700',
  keldi: 'bg-green-100 text-green-700',
  kelmadi: 'bg-red-100 text-red-700',
}

const LEAD_STATUS_CLASSES: Record<string, string> = {
  "O'qishga yozildi": 'bg-emerald-100 text-emerald-700',
  "Yo'qotildi": 'bg-rose-100 text-rose-700',
  'Yangi': 'bg-blue-100 text-blue-700',
  'Aloqada': 'bg-yellow-100 text-yellow-700',
  'Sinovda': 'bg-purple-100 text-purple-700',
  'Sinovda qatnashdi': 'bg-indigo-100 text-indigo-700',
  'Sinovdan ketdi': 'bg-orange-100 text-orange-700',
}
</script>
```

---

### 5.2 Conversion Funnel Chart

Using **Chart.js** with `vue-chartjs`:

```vue
<!-- components/LeadsConversionFunnel.vue -->
<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { LeadsStatisticsSummary } from '~/types/leads-statistics'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{ summary: LeadsStatisticsSummary }>()

const chartData = computed(() => ({
  labels: ['Tayinlangan', 'Keldi', 'Kelmadi', "O'quvchi bo'ldi", "Yo'qotildi", 'Jarayonda'],
  datasets: [
    {
      label: 'Soni',
      data: [
        props.summary.totalAssigned,
        props.summary.totalAttended,
        props.summary.totalNotAttended,
        props.summary.totalBecameStudent,
        props.summary.totalLost,
        props.summary.totalInProgress,
      ],
      backgroundColor: [
        '#3b82f6', '#22c55e', '#ef4444', '#10b981', '#f43f5e', '#f59e0b',
      ],
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
}
</script>

<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h3 class="font-semibold text-lg mb-4">Konversiya funnel</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
```

Usage:

```vue
<LeadsConversionFunnel :summary="stats.summary" />
```

---

### 5.3 Single Teacher Detail Card

```vue
<!-- components/TeacherLeadCard.vue -->
<script setup lang="ts">
import type { TeacherLeadStats } from '~/types/leads-statistics'

const props = defineProps<{ teacher: TeacherLeadStats }>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-lg">{{ teacher.teacherName }}</h3>
      <span
        class="text-sm font-bold px-3 py-1 rounded-full"
        :class="teacher.conversionRate >= 50 ? 'bg-green-100 text-green-700' : teacher.conversionRate >= 25 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'"
      >
        {{ teacher.conversionRate }}% konversiya
      </span>
    </div>

    <!-- Mini stat grid -->
    <div class="grid grid-cols-3 gap-3 text-center text-sm">
      <div>
        <p class="text-gray-400">Tayinlangan</p>
        <p class="text-xl font-bold text-blue-600">{{ teacher.totalAssigned }}</p>
      </div>
      <div>
        <p class="text-gray-400">O'quvchi bo'ldi</p>
        <p class="text-xl font-bold text-emerald-600">{{ teacher.becameStudent }}</p>
      </div>
      <div>
        <p class="text-gray-400">Yo'qotildi</p>
        <p class="text-xl font-bold text-rose-600">{{ teacher.lost }}</p>
      </div>
    </div>

    <!-- Visual bar -->
    <div class="flex h-3 rounded-full overflow-hidden bg-gray-100">
      <div
        class="bg-emerald-500"
        :style="{ width: `${teacher.totalAssigned > 0 ? (teacher.becameStudent / teacher.totalAssigned) * 100 : 0}%` }"
      />
      <div
        class="bg-amber-400"
        :style="{ width: `${teacher.totalAssigned > 0 ? (teacher.inProgress / teacher.totalAssigned) * 100 : 0}%` }"
      />
      <div
        class="bg-rose-500"
        :style="{ width: `${teacher.totalAssigned > 0 ? (teacher.lost / teacher.totalAssigned) * 100 : 0}%` }"
      />
    </div>
    <div class="flex justify-between text-xs text-gray-400">
      <span>O'quvchi bo'ldi</span>
      <span>Jarayonda</span>
      <span>Yo'qotildi</span>
    </div>
  </div>
</template>
```

Usage:

```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <TeacherLeadCard v-for="t in stats.teachers" :key="t.teacher_id" :teacher="t" />
</div>
```

---

## 6. Reusable Components

### 6.1 Date Range Filter

```vue
<!-- components/DateRangeFilter.vue -->
<script setup lang="ts">
const startDate = defineModel<string>('startDate', { default: '' })
const endDate = defineModel<string>('endDate', { default: '' })

const presets = [
  { label: 'Bu oy', start: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10), end: () => '' },
  { label: "O'tgan oy", start: () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 10), end: () => new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().slice(0, 10) },
  { label: 'Oxirgi 3 oy', start: () => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().slice(0, 10) }, end: () => '' },
  { label: 'Bu yil', start: () => `${new Date().getFullYear()}-01-01`, end: () => '' },
]

function applyPreset(p: typeof presets[number]) {
  startDate.value = p.start()
  endDate.value = p.end()
}

function clear() {
  startDate.value = ''
  endDate.value = ''
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <input v-model="startDate" type="date" class="border rounded px-3 py-2 text-sm" />
    <span class="text-gray-400">—</span>
    <input v-model="endDate" type="date" class="border rounded px-3 py-2 text-sm" />
    <button
      v-for="p in presets" :key="p.label"
      class="px-3 py-1.5 text-xs rounded-full border hover:bg-gray-100"
      @click="applyPreset(p)"
    >{{ p.label }}</button>
    <button class="text-xs text-gray-400 underline" @click="clear">Tozalash</button>
  </div>
</template>
```

---

### 6.2 Stat Card

```vue
<!-- components/StatCard.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  color?: string
}>()
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 text-center">
    <p class="text-sm text-gray-500">{{ label }}</p>
    <p
      class="text-3xl font-bold mt-1"
      :class="`text-${color ?? 'gray'}-600`"
    >{{ value }}</p>
  </div>
</template>
```

---

### 6.3 Conversion Bar

```vue
<!-- components/ConversionBar.vue -->
<script setup lang="ts">
const props = defineProps<{ rate: number }>()

const barColor = computed(() =>
  props.rate >= 50 ? 'bg-emerald-500' : props.rate >= 25 ? 'bg-amber-400' : 'bg-rose-500',
)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div :class="barColor" class="h-full rounded-full" :style="{ width: `${rate}%` }" />
    </div>
    <span class="text-xs font-medium" :class="rate >= 50 ? 'text-emerald-600' : rate >= 25 ? 'text-amber-600' : 'text-rose-600'">
      {{ rate }}%
    </span>
  </div>
</template>
```

---

## 7. Status Labels & Colors

```ts
// utils/lead-status.ts

/** Trial lesson statuses */
export const TRIAL_STATUS_LABELS: Record<string, string> = {
  belgilangan: 'Belgilangan',
  keldi: 'Keldi',
  kelmadi: 'Kelmadi',
}

export const TRIAL_STATUS_COLORS: Record<string, string> = {
  belgilangan: '#3b82f6',   // blue
  keldi: '#22c55e',         // green
  kelmadi: '#ef4444',       // red
}

export const TRIAL_STATUS_CLASSES: Record<string, string> = {
  belgilangan: 'bg-blue-100 text-blue-700',
  keldi: 'bg-green-100 text-green-700',
  kelmadi: 'bg-red-100 text-red-700',
}

/** Lead pipeline statuses */
export const LEAD_STATUS_CLASSES: Record<string, string> = {
  'Yangi': 'bg-blue-100 text-blue-700',
  'Aloqada': 'bg-yellow-100 text-yellow-700',
  'Sinovda': 'bg-purple-100 text-purple-700',
  'Sinovda qatnashdi': 'bg-indigo-100 text-indigo-700',
  'Sinovdan ketdi': 'bg-orange-100 text-orange-700',
  "O'qishga yozildi": 'bg-emerald-100 text-emerald-700',
  "Yo'qotildi": 'bg-rose-100 text-rose-700',
}
```
