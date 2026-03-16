# Teacher Transaction API — Frontend & Mobile Integration Guide

> **Base path:** `/teacher-transaction`  
> **Auth:** `Authorization: Bearer <JWT_TOKEN>` (required on every request)  
> **Roles:** `ADMIN` can use all endpoints · `TEACHER` can read only

---

## Table of Contents

1. [Transaction Types](#1-transaction-types)
2. [Endpoints Overview](#2-endpoints-overview)
3. [List Transactions (paginated)](#3-list-transactions-paginated)
4. [Yearly Salary Stats — oylik](#4-yearly-salary-stats--oylik)
5. [Transactions by Teacher](#5-transactions-by-teacher)
6. [Get Single Transaction](#6-get-single-transaction)
7. [Create Transaction (Admin)](#7-create-transaction-admin)
8. [Update Transaction (Admin)](#8-update-transaction-admin)
9. [Delete Transaction (Admin)](#9-delete-transaction-admin)
10. [Nuxt 4 — Composables](#10-nuxt-4--composables)
11. [Expo — React Native hooks](#11-expo--react-native-hooks)
12. [TypeScript Types](#12-typescript-types)

---

## 1. Transaction Types

| Value | Meaning |
|-------|---------|
| `oylik` | Monthly salary payment |
| `kirim` | Income / incoming payment |
| `avans` | Advance/prepayment |
| `bonus` | Bonus payment |

---

## 2. Endpoints Overview

| Method | Path | Role | Description |
|--------|------|------|-------------|
| `GET` | `/teacher-transaction` | ADMIN, TEACHER | List all transactions (paginated) |
| `GET` | `/teacher-transaction/stats/salary/yearly` | ADMIN, TEACHER | Yearly oylik stats month by month |
| `GET` | `/teacher-transaction/teacher/:teacherId` | ADMIN, TEACHER | All transactions for one teacher |
| `GET` | `/teacher-transaction/:id` | ADMIN, TEACHER | Single transaction by ID |
| `POST` | `/teacher-transaction` | ADMIN | Create a transaction |
| `PATCH` | `/teacher-transaction/:id` | ADMIN | Update a transaction |
| `DELETE` | `/teacher-transaction/:id` | ADMIN | Soft-delete a transaction |

---

## 3. List Transactions (paginated)

```http
GET /teacher-transaction?page=1&limit=10&type=oylik&teacher_id=<UUID>
Authorization: Bearer <TOKEN>
```

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `type` | `kirim\|oylik\|avans\|bonus` | — | Filter by type |
| `teacher_id` | UUID string | — | Filter by teacher |
| `student_id` | UUID string | — | Filter by student |
| `branch_id` | UUID string | — | Filter by branch |
| `search` | string | — | Search in teacher/student first_name, last_name, username |
| `start_date` | ISO 8601 string | — | Created at ≥ this date |
| `end_date` | ISO 8601 string | — | Created at ≤ this date |

### Response

```json
{
  "data": [
    {
      "id": "uuid",
      "teacher_id": "uuid",
      "student_id": "uuid",
      "branch_id": "uuid",
      "amount": 1500000,
      "type": "oylik",
      "created_at": "2026-03-01T10:00:00.000Z",
      "updated_at": "2026-03-01T10:00:00.000Z",
      "teacher": {
        "user_id": "uuid",
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+998901234567"
      },
      "student": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  },
  "totalAmount": 63000000
}
```

---

## 4. Yearly Salary Stats — oylik

Returns all 12 months for the given year with the total `oylik` amount paid per month. Months with no payments return `total: 0`.

```http
GET /teacher-transaction/stats/salary/yearly?year=2026&teacher_id=<UUID>
Authorization: Bearer <TOKEN>
```

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `year` | number | No | Year to aggregate. Defaults to current year |
| `teacher_id` | UUID string | No | Scope to a single teacher. Omit to aggregate all teachers |

### Response

```json
{
  "year": 2026,
  "teacher_id": "uuid-optional",
  "months": [
    { "month": 1,  "monthName": "January",   "total": 3000000 },
    { "month": 2,  "monthName": "February",  "total": 3000000 },
    { "month": 3,  "monthName": "March",     "total": 1500000 },
    { "month": 4,  "monthName": "April",     "total": 0 },
    { "month": 5,  "monthName": "May",       "total": 0 },
    { "month": 6,  "monthName": "June",      "total": 0 },
    { "month": 7,  "monthName": "July",      "total": 0 },
    { "month": 8,  "monthName": "August",    "total": 0 },
    { "month": 9,  "monthName": "September", "total": 0 },
    { "month": 10, "monthName": "October",   "total": 0 },
    { "month": 11, "monthName": "November",  "total": 0 },
    { "month": 12, "monthName": "December",  "total": 0 }
  ],
  "yearlyTotal": 7500000
}
```

> **Note:** `teacher_id` is only present in the response when it was passed as a query param.

---

## 5. Transactions by Teacher

```http
GET /teacher-transaction/teacher/<teacherId>?type=oylik
Authorization: Bearer <TOKEN>
```

Returns all transactions (no pagination) for the given teacher, sorted newest-first. Optionally filter by `type`.

### Response

Array of transaction objects (same shape as `data[]` in the list endpoint, without the `teacher`/`student` associations).

```json
[
  {
    "id": "uuid",
    "teacher_id": "uuid",
    "student_id": null,
    "branch_id": "uuid",
    "amount": 1500000,
    "type": "oylik",
    "created_at": "2026-03-01T10:00:00.000Z",
    "updated_at": "2026-03-01T10:00:00.000Z"
  }
]
```

Returns **404** if no transactions exist for that teacher.

---

## 6. Get Single Transaction

```http
GET /teacher-transaction/<id>
Authorization: Bearer <TOKEN>
```

Returns **404** if not found.

---

## 7. Create Transaction (Admin)

```http
POST /teacher-transaction
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "teacher_id": "uuid",
  "student_id": "uuid",      // optional
  "branch_id": "uuid",       // optional
  "amount": 1500000,
  "type": "oylik"
}
```

Returns **201** with the created transaction object.

---

## 8. Update Transaction (Admin)

```http
PATCH /teacher-transaction/<id>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "amount": 2000000
}
```

All fields are optional (partial update).

---

## 9. Delete Transaction (Admin)

```http
DELETE /teacher-transaction/<id>
Authorization: Bearer <TOKEN>
```

Soft-deletes the transaction and deducts the amount from the teacher's wallet. Returns **204 No Content**.

---

## 10. Nuxt 4 — Composables

### Setup: `composables/useApi.ts`

```ts
// composables/useApi.ts
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

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL ?? 'http://localhost:3000',
    },
  },
})
```

---

### `composables/useTeacherTransactions.ts`

```ts
import type {
  TeacherTransaction,
  TeacherTransactionListResponse,
  TeacherTransactionListQuery,
  YearlySalaryStats,
} from '~/types/teacher-transaction'

export const useTeacherTransactions = () => {
  const { apiFetch } = useApi()

  // ── List (paginated) ─────────────────────────────────────────────────────
  const fetchTransactions = (query: TeacherTransactionListQuery = {}) =>
    apiFetch<TeacherTransactionListResponse>('/teacher-transaction', {
      query,
    })

  // ── Yearly salary stats ──────────────────────────────────────────────────
  const fetchYearlySalaryStats = (
    year?: number,
    teacherId?: string,
  ) =>
    apiFetch<YearlySalaryStats>('/teacher-transaction/stats/salary/yearly', {
      query: {
        ...(year ? { year } : {}),
        ...(teacherId ? { teacher_id: teacherId } : {}),
      },
    })

  // ── By teacher (all, no pagination) ─────────────────────────────────────
  const fetchByTeacher = (teacherId: string, type?: string) =>
    apiFetch<TeacherTransaction[]>(
      `/teacher-transaction/teacher/${teacherId}`,
      { query: type ? { type } : {} },
    )

  // ── Single ───────────────────────────────────────────────────────────────
  const fetchOne = (id: string) =>
    apiFetch<TeacherTransaction>(`/teacher-transaction/${id}`)

  // ── Create (Admin) ───────────────────────────────────────────────────────
  const createTransaction = (body: Partial<TeacherTransaction>) =>
    apiFetch<TeacherTransaction>('/teacher-transaction', {
      method: 'POST',
      body,
    })

  // ── Update (Admin) ───────────────────────────────────────────────────────
  const updateTransaction = (id: string, body: Partial<TeacherTransaction>) =>
    apiFetch<TeacherTransaction>(`/teacher-transaction/${id}`, {
      method: 'PATCH',
      body,
    })

  // ── Delete (Admin) ───────────────────────────────────────────────────────
  const deleteTransaction = (id: string) =>
    apiFetch(`/teacher-transaction/${id}`, { method: 'DELETE' })

  return {
    fetchTransactions,
    fetchYearlySalaryStats,
    fetchByTeacher,
    fetchOne,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
```

---

### Page Example — Yearly Salary Chart (`pages/salary-stats.vue`)

```vue
<script setup lang="ts">
const { fetchYearlySalaryStats } = useTeacherTransactions()

const route = useRoute()
const teacherId = route.query.teacher_id as string | undefined

const year = ref(new Date().getFullYear())
const { data: stats, pending, refresh } = await useAsyncData(
  `salary-stats-${year.value}`,
  () => fetchYearlySalaryStats(year.value, teacherId),
  { watch: [year] },
)
</script>

<template>
  <div>
    <h1>Oylik Statistics — {{ year }}</h1>

    <select v-model="year">
      <option v-for="y in [2024, 2025, 2026]" :key="y" :value="y">{{ y }}</option>
    </select>

    <p v-if="pending">Loading…</p>

    <template v-else-if="stats">
      <p>Yearly total: <strong>{{ stats.yearlyTotal.toLocaleString() }}</strong> UZS</p>

      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount (UZS)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in stats.months" :key="m.month">
            <td>{{ m.monthName }}</td>
            <td>{{ m.total.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
```

---

## 11. Expo — React Native hooks

### Setup: `lib/api.ts`

```ts
// lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage'

export const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:3000'

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const token = await AsyncStorage.getItem('access_token')

  let url = `${API_BASE}${path}`
  if (options.query) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(options.query)) {
      if (v !== undefined && v !== null) params.append(k, String(v))
    }
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.message ?? `HTTP ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
```

---

### `hooks/useTeacherTransactions.ts`

```ts
import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import type {
  TeacherTransaction,
  TeacherTransactionListResponse,
  TeacherTransactionListQuery,
  YearlySalaryStats,
} from '../types/teacher-transaction'

// ── Yearly salary stats ──────────────────────────────────────────────────────
export function useYearlySalaryStats(year: number, teacherId?: string) {
  const [data, setData] = useState<YearlySalaryStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFetch<YearlySalaryStats>(
        '/teacher-transaction/stats/salary/yearly',
        { query: { year, ...(teacherId ? { teacher_id: teacherId } : {}) } },
      )
      setData(result)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [year, teacherId])

  useEffect(() => { load() }, [load])

  return { data, loading, error, refresh: load }
}

// ── List transactions (paginated) ────────────────────────────────────────────
export function useTeacherTransactionList(query: TeacherTransactionListQuery = {}) {
  const [data, setData] = useState<TeacherTransactionListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFetch<TeacherTransactionListResponse>(
        '/teacher-transaction',
        { query: query as Record<string, string | number | undefined> },
      )
      setData(result)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(query)])

  useEffect(() => { load() }, [load])

  return { data, loading, error, refresh: load }
}

// ── Transactions by teacher ──────────────────────────────────────────────────
export function useTransactionsByTeacher(teacherId: string, type?: string) {
  const [data, setData] = useState<TeacherTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFetch<TeacherTransaction[]>(
        `/teacher-transaction/teacher/${teacherId}`,
        { query: type ? { type } : {} },
      )
      setData(result)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [teacherId, type])

  useEffect(() => { load() }, [load])

  return { data, loading, error, refresh: load }
}
```

---

### Screen Example — Yearly Salary Chart (`screens/SalaryStatsScreen.tsx`)

```tsx
import React, { useState } from 'react'
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useYearlySalaryStats } from '../hooks/useTeacherTransactions'

type Props = { teacherId?: string }

export default function SalaryStatsScreen({ teacherId }: Props) {
  const [year, setYear] = useState(new Date().getFullYear())
  const { data, loading, error, refresh } = useYearlySalaryStats(year, teacherId)

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />
  if (error) return <Text style={styles.error}>{error}</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oylik — {year}</Text>
      <Text style={styles.total}>
        Yearly total: {data?.yearlyTotal.toLocaleString()} UZS
      </Text>

      <FlatList
        data={data?.months}
        keyExtractor={(item) => String(item.month)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.monthName}>{item.monthName}</Text>
            <Text style={[styles.amount, item.total === 0 && styles.zero]}>
              {item.total.toLocaleString()} UZS
            </Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title:     { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  total:     { fontSize: 16, marginBottom: 16, color: '#555' },
  row:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  monthName: { fontSize: 15 },
  amount:    { fontSize: 15, fontWeight: '600' },
  zero:      { color: '#aaa' },
  error:     { color: 'red', padding: 16 },
})
```

---

## 12. TypeScript Types

Place these in `types/teacher-transaction.ts` (shared between Nuxt and Expo projects).

```ts
// types/teacher-transaction.ts

export type TransactionType = 'kirim' | 'oylik' | 'avans' | 'bonus'

export interface TeacherUser {
  user_id: string
  username: string
  first_name: string
  last_name: string
  phone: string
}

export interface TeacherTransaction {
  id: string
  teacher_id: string
  student_id: string | null
  branch_id: string | null
  amount: number
  type: TransactionType
  created_at: string
  updated_at: string
  deleted_at: string | null
  teacher?: TeacherUser | null
  student?: TeacherUser | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TeacherTransactionListResponse {
  data: TeacherTransaction[]
  pagination: Pagination
  totalAmount: number
}

export interface TeacherTransactionListQuery {
  page?: number
  limit?: number
  type?: TransactionType
  teacher_id?: string
  student_id?: string
  branch_id?: string
  search?: string
  start_date?: string
  end_date?: string
}

export interface SalaryMonth {
  month: number       // 1–12
  monthName: string   // "January" … "December"
  total: number       // sum of oylik amounts; 0 if none
}

export interface YearlySalaryStats {
  year: number
  teacher_id?: string
  months: SalaryMonth[]
  yearlyTotal: number
}
```
