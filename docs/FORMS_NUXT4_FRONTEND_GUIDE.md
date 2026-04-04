# Forms — Nuxt 4 Frontend Integration Guide

Build dynamic forms with Vueform, share them via public links, and view responses in an admin dashboard.

---

## Table of Contents

- [Overview](#overview)
- [API Endpoints](#api-endpoints)
- [Setup & Dependencies](#setup--dependencies)
- [Nuxt Config](#nuxt-config)
- [Composables](#composables)
- [Pages](#pages)
  - [Public Form Page — `/forms/:id`](#1-public-form-page)
  - [Admin: Form Builder](#2-admin-form-builder)
  - [Admin: All Forms List](#3-admin-all-forms-list)
  - [Admin: Form Responses](#4-admin-form-responses-page)
- [Sharing Public Links](#sharing-public-links)
- [Data Models](#data-models)

---

## Overview

| Feature | Description |
|---------|-------------|
| **Form Schema** | Stored as Vueform-compatible JSON in the backend |
| **Public Form Page** | Anyone can open `https://forms.impulselc.uz/:id` and submit a response (no auth) |
| **Form Responses** | Admins view all submitted responses in a table with export options |
| **Backend** | NestJS REST API with Sequelize (PostgreSQL) |

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/forms` | JWT | Create a new form |
| `GET` | `/forms` | JWT | List all forms |
| `GET` | `/forms/:id` | **Public** | Get a form by ID (used by public page) |
| `PATCH` | `/forms/:id` | JWT | Update a form |
| `DELETE` | `/forms/:id` | JWT | Delete a form |
| `POST` | `/forms/responses` | **Public** | Submit a response |
| `GET` | `/forms/responses` | JWT | List all responses |
| `GET` | `/forms/responses/form/:formId` | JWT | List responses for a specific form |
| `GET` | `/forms/responses/:id` | JWT | Get a single response |
| `PATCH` | `/forms/responses/:id` | JWT | Update a response |
| `DELETE` | `/forms/responses/:id` | JWT | Delete a response |

---

## Setup & Dependencies

```bash
# Install Vueform (form renderer)
npm install @vueform/vueform

# Optional: export responses to CSV/Excel
npm install xlsx file-saver
```

---

## Nuxt Config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@vueform/nuxt',
  ],

  vueform: {
    configPath: '~/vueform.config.ts',
  },

  routeRules: {
    '/forms/**': { ssr: true },                  // SSR for public form pages (SEO / link previews)
    '/admin/forms/**': { ssr: false },            // SPA for admin area
  },
})
```

```ts
// vueform.config.ts
import en from '@vueform/vueform/locales/en'
import tailwind from '@vueform/vueform/dist/tailwind' // or vueform, bootstrap, material

export default {
  theme: tailwind,
  locales: { en },
  locale: 'en',
}
```

---

## Composables

### `composables/useFormsApi.ts`

```ts
export function useFormsApi() {
  const config = useRuntimeConfig()
  const API = config.public.apiBase // e.g. https://api.impulselc.uz

  // ─── Public (no auth) ────────────────────────
  async function getForm(id: string) {
    return await $fetch<Form>(`${API}/forms/${id}`)
  }

  async function submitResponse(formId: string, answers: Record<string, any>) {
    return await $fetch<FormResponse>(`${API}/forms/responses`, {
      method: 'POST',
      body: { form_id: formId, answers },
    })
  }

  // ─── Admin (auth required) ───────────────────
  function authHeaders() {
    const token = useCookie('token').value
    return { Authorization: `Bearer ${token}` }
  }

  async function listForms() {
    return await $fetch<Form[]>(`${API}/forms`, {
      headers: authHeaders(),
    })
  }

  async function createForm(title: string, schema: object) {
    return await $fetch<Form>(`${API}/forms`, {
      method: 'POST',
      headers: authHeaders(),
      body: { title, schema },
    })
  }

  async function updateForm(id: string, data: Partial<{ title: string; schema: object }>) {
    return await $fetch<Form>(`${API}/forms/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: data,
    })
  }

  async function deleteForm(id: string) {
    return await $fetch(`${API}/forms/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  async function getFormResponses(formId: string) {
    return await $fetch<FormResponse[]>(`${API}/forms/responses/form/${formId}`, {
      headers: authHeaders(),
    })
  }

  async function deleteResponse(id: string) {
    return await $fetch(`${API}/forms/responses/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  }

  return {
    getForm,
    submitResponse,
    listForms,
    createForm,
    updateForm,
    deleteForm,
    getFormResponses,
    deleteResponse,
  }
}
```

---

## Pages

### 1. Public Form Page

**Route:** `pages/forms/[id].vue`  
**URL:** `https://forms.impulselc.uz/:id`  
No authentication required. Renders the Vueform schema and submits the response.

```vue
<script setup lang="ts">
const route = useRoute()
const formId = route.params.id as string
const { getForm, submitResponse } = useFormsApi()

const { data: form, status } = await useAsyncData(`form-${formId}`, () => getForm(formId))

const submitted = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

async function onSubmit(formData: Record<string, any>) {
  submitting.value = true
  errorMsg.value = ''
  try {
    await submitResponse(formId, formData)
    submitted.value = true
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <!-- Loading -->
    <div v-if="status === 'pending'" class="text-center">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
      <p class="mt-3 text-gray-500">Loading form…</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!form" class="text-center">
      <h1 class="text-2xl font-bold text-gray-800">Form not found</h1>
      <p class="text-gray-500 mt-2">This form may have been removed or the link is invalid.</p>
    </div>

    <!-- Success -->
    <div v-else-if="submitted" class="text-center max-w-md">
      <div class="text-green-500 text-5xl mb-4">✓</div>
      <h1 class="text-2xl font-bold text-gray-800">Thank you!</h1>
      <p class="text-gray-500 mt-2">Your response has been recorded.</p>
    </div>

    <!-- Form -->
    <div v-else class="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ form.title }}</h1>

      <p v-if="errorMsg" class="text-red-500 text-sm mb-4">{{ errorMsg }}</p>

      <Vueform
        :schema="form.schema"
        :loading="submitting"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>
```

#### SEO Meta (optional)

```ts
// inside <script setup>
useHead({
  title: form.value?.title ?? 'Form',
})

useSeoMeta({
  ogTitle: form.value?.title,
  ogDescription: `Fill out: ${form.value?.title}`,
  ogUrl: `https://forms.impulselc.uz/${formId}`,
})
```

---

### 2. Admin: Form Builder

**Route:** `pages/admin/forms/create.vue`

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { createForm } = useFormsApi()
const router = useRouter()

const title = ref('')
const schema = ref<object>({})
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    const form = await createForm(title.value, schema.value)
    navigateTo(`/admin/forms/${form.id}/responses`)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Create New Form</h1>

    <label class="block mb-4">
      <span class="text-sm font-medium text-gray-700">Form Title</span>
      <input
        v-model="title"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g. Student Registration Form"
      />
    </label>

    <!-- Vueform Builder (drag-and-drop) -->
    <VueformBuilder v-model="schema" class="mb-6" />

    <!-- OR: Manual JSON Schema Editor -->
    <details class="mb-6">
      <summary class="cursor-pointer text-sm text-gray-500">Edit schema as JSON</summary>
      <textarea
        :value="JSON.stringify(schema, null, 2)"
        @input="(e: Event) => { try { schema = JSON.parse((e.target as HTMLTextAreaElement).value) } catch {} }"
        rows="12"
        class="mt-2 w-full font-mono text-sm border rounded-md p-3"
      />
    </details>

    <div class="flex gap-3">
      <button
        :disabled="!title || saving"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        @click="save"
      >
        {{ saving ? 'Saving…' : 'Create Form' }}
      </button>
    </div>
  </div>
</template>
```

---

### 3. Admin: All Forms List

**Route:** `pages/admin/forms/index.vue`

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { listForms, deleteForm } = useFormsApi()
const { data: forms, refresh } = await useAsyncData('forms-list', listForms)

const PUBLIC_URL = 'https://forms.impulselc.uz'

function copyLink(id: string) {
  navigator.clipboard.writeText(`${PUBLIC_URL}/${id}`)
}

async function handleDelete(id: string) {
  if (!confirm('Delete this form and all its responses?')) return
  await deleteForm(id)
  refresh()
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Forms</h1>
      <NuxtLink to="/admin/forms/create" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + New Form
      </NuxtLink>
    </div>

    <div v-if="!forms?.length" class="text-center py-12 text-gray-400">
      No forms yet. Create your first form.
    </div>

    <div class="space-y-3">
      <div
        v-for="form in forms"
        :key="form.id"
        class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold text-gray-800">{{ form.title }}</h3>
          <p class="text-sm text-gray-400 mt-1">
            {{ PUBLIC_URL }}/{{ form.id }}
          </p>
        </div>

        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
            title="Copy public link"
            @click="copyLink(form.id)"
          >
            📋 Copy Link
          </button>

          <NuxtLink
            :to="`/admin/forms/${form.id}/responses`"
            class="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            📊 Responses
          </NuxtLink>

          <NuxtLink
            :to="`/admin/forms/${form.id}/edit`"
            class="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
          >
            ✏️ Edit
          </NuxtLink>

          <button
            class="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
            @click="handleDelete(form.id)"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

### 4. Admin: Form Responses Page

**Route:** `pages/admin/forms/[id]/responses.vue`

View all submitted responses in a table. Supports column auto-detection from answers JSON, row deletion, and CSV export.

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const formId = route.params.id as string
const { getForm, getFormResponses, deleteResponse } = useFormsApi()

const { data: form } = await useAsyncData(`form-${formId}`, () => getForm(formId))
const { data: responses, refresh } = await useAsyncData(`responses-${formId}`, () => getFormResponses(formId))

const PUBLIC_URL = 'https://forms.impulselc.uz'

// ─── Compute columns from all answer keys ───
const columns = computed(() => {
  if (!responses.value?.length) return []
  const keys = new Set<string>()
  for (const r of responses.value) {
    if (r.answers && typeof r.answers === 'object') {
      Object.keys(r.answers).forEach(k => keys.add(k))
    }
  }
  return Array.from(keys)
})

// ─── Search / Filter ───
const search = ref('')
const filtered = computed(() => {
  if (!search.value.trim()) return responses.value ?? []
  const q = search.value.toLowerCase()
  return (responses.value ?? []).filter(r =>
    JSON.stringify(r.answers).toLowerCase().includes(q)
  )
})

// ─── Delete ───
async function handleDeleteResponse(id: string) {
  if (!confirm('Delete this response?')) return
  await deleteResponse(id)
  refresh()
}

// ─── Export to CSV ───
function exportCsv() {
  if (!filtered.value.length) return
  const header = ['#', 'Submitted At', ...columns.value]
  const rows = filtered.value.map((r, i) => [
    i + 1,
    new Date(r.createdAt).toLocaleString(),
    ...columns.value.map(col => {
      const val = r.answers?.[col]
      return typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')
    }),
  ])
  const csv = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${form.value?.title ?? 'form'}-responses.csv`
  link.click()
}

function copyLink() {
  navigator.clipboard.writeText(`${PUBLIC_URL}/${formId}`)
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <NuxtLink to="/admin/forms" class="text-sm text-blue-600 hover:underline">← All Forms</NuxtLink>
        <h1 class="text-2xl font-bold mt-1">{{ form?.title }} — Responses</h1>
        <p class="text-sm text-gray-400 mt-1">
          {{ responses?.length ?? 0 }} total responses
        </p>
      </div>

      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
          @click="copyLink"
        >
          📋 Copy Public Link
        </button>
        <button
          class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          @click="exportCsv"
        >
          📥 Export CSV
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search responses…"
        class="w-full sm:w-80 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!responses?.length" class="text-center py-16 text-gray-400">
      <p class="text-lg">No responses yet</p>
      <p class="mt-2 text-sm">
        Share this link to collect responses:
        <br />
        <code class="bg-gray-100 px-2 py-1 rounded text-blue-600 select-all">
          {{ PUBLIC_URL }}/{{ formId }}
        </code>
      </p>
    </div>

    <!-- Responses Table -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th
              v-for="col in columns"
              :key="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              {{ col }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(resp, index) in filtered" :key="resp.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
            <td
              v-for="col in columns"
              :key="col"
              class="px-4 py-3 text-sm text-gray-800"
            >
              <template v-if="typeof resp.answers?.[col] === 'object'">
                <pre class="text-xs bg-gray-50 rounded p-1 max-w-xs overflow-auto">{{ JSON.stringify(resp.answers[col], null, 2) }}</pre>
              </template>
              <template v-else>
                {{ resp.answers?.[col] ?? '—' }}
              </template>
            </td>
            <td class="px-4 py-3 text-sm text-gray-400">
              {{ new Date(resp.createdAt).toLocaleDateString() }}
              <br />
              <span class="text-xs">{{ new Date(resp.createdAt).toLocaleTimeString() }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-right">
              <button
                class="text-red-500 hover:text-red-700 text-sm"
                @click="handleDeleteResponse(resp.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

---

## Sharing Public Links

Forms are publicly accessible at:

```
https://forms.impulselc.uz/{form-id}
```

**Example:**

```
https://forms.impulselc.uz/a3f1c72e-8b4d-4e6a-9c1f-2d3e4f5a6b7c
```

### How it works

1. Admin creates a form → backend returns a UUID `id`
2. The public URL `https://forms.impulselc.uz/:id` routes to `pages/forms/[id].vue`
3. The page calls `GET /forms/:id` (public, no auth) to fetch the Vueform schema
4. User fills in the form and submits → `POST /forms/responses` (public, no auth)
5. Admin views responses at `/admin/forms/:id/responses`

### Nuxt route setup for `forms.impulselc.uz`

If `forms.impulselc.uz` is a separate subdomain pointing to the same Nuxt app, configure it via a route rule or a separate Nuxt layer. If it's a standalone Nuxt app dedicated to public forms, the `pages/` structure is simply:

```
pages/
  [id].vue     ← renders the public form
```

---

## Data Models

### `types/forms.ts`

```ts
export interface Form {
  id: string
  title: string
  schema: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface FormResponse {
  id: string
  form_id: string
  answers: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

---

## Quick Reference

| Task | Page | URL |
|------|------|-----|
| Fill out a form (public) | `pages/forms/[id].vue` | `https://forms.impulselc.uz/:id` |
| Create a form | `pages/admin/forms/create.vue` | `/admin/forms/create` |
| List all forms | `pages/admin/forms/index.vue` | `/admin/forms` |
| View responses | `pages/admin/forms/[id]/responses.vue` | `/admin/forms/:id/responses` |
| Edit a form | `pages/admin/forms/[id]/edit.vue` | `/admin/forms/:id/edit` |
