# Audio Trending Feed API - Frontend Integration Guide

> **Endpoint:** `/audio/trending`  
> **Method:** `GET`  
> **Auth:** `Authorization: Bearer <JWT_TOKEN>`  
> **Roles:** STUDENT, TEACHER, ADMIN

---

## 1. Overview

Use this endpoint to render the public audio feed with:

- Pagination (`page`, `limit`)
- Search by student username (`search`)
- Sort direction filter (`filter=top|low`)
- Per-user interaction flags (`isLiked`, `isJudged`)

The backend always returns paginated data and includes student profile info for each audio.

---

## 2. Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page |
| `search` | string | - | Partial search on student's `username` |
| `filter` | `top` \| `low` | `top` | Sort by `trendingScore` and then `createdAt` |

### Sorting behavior

- `filter=top`: highest `trendingScore` first, newest first
- `filter=low`: lowest `trendingScore` first, oldest first

---

## 3. Request Examples

### Get top feed

```http
GET /audio/trending?page=1&limit=20
Authorization: Bearer <JWT_TOKEN>
```

### Search by username

```http
GET /audio/trending?search=john
Authorization: Bearer <JWT_TOKEN>
```

### Low-to-high feed

```http
GET /audio/trending?filter=low
Authorization: Bearer <JWT_TOKEN>
```

### Combined

```http
GET /audio/trending?page=1&limit=10&search=john&filter=top
Authorization: Bearer <JWT_TOKEN>
```

---

## 4. Response Shape

```json
{
  "audios": [
    {
      "id": 123,
      "taskId": 8,
      "caption": "My pronunciation challenge",
      "durationSeconds": 42,
      "audioUrl": "https://.../audios/file.mp3",
      "studentId": "user-uuid",
      "status": "completed",
      "likeCount": 15,
      "commentCount": 4,
      "judgeCount": 3,
      "averageRating": 4.3,
      "trendingScore": 28,
      "createdAt": "2026-03-15T10:00:00.000Z",
      "updatedAt": "2026-03-15T10:02:00.000Z",
      "task": {
        "id": 8,
        "title": "Speaking Prompt"
      },
      "student": {
        "user_id": "user-uuid",
        "first_name": "John",
        "last_name": "Doe",
        "username": "john_doe",
        "avatar_url": "https://...",
        "level_id": 2,
        "level": {
          "id": 2,
          "title": "B1",
          "level": "Intermediate"
        }
      },
      "isLiked": true,
      "isJudged": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13
  }
}
```

---

## 5. Frontend Integration Notes

1. Use debounced search input (300-500ms) before calling the endpoint.
2. Reset `page` to `1` when `search` or `filter` changes.
3. Keep `search` and `filter` in URL query state so refresh/back works.
4. Use `isLiked` and `isJudged` directly to control icon/button states.
5. Stop infinite scroll when `page >= totalPages`.

---

## 6. TypeScript Example

```ts
export type TrendingFilter = "top" | "low";

export interface GetTrendingFeedParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: TrendingFilter;
}

export async function getTrendingFeed(
  token: string,
  params: GetTrendingFeedParams = {},
) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
    ...(params.search ? { search: params.search } : {}),
    ...(params.filter ? { filter: params.filter } : {}),
  });

  const res = await fetch(`/audio/trending?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load trending feed: ${res.status}`);
  }

  return res.json();
}
```

---

## 7. Error Handling

- `401 Unauthorized`: token missing/expired
- `403 Forbidden`: role is not allowed
- `400 Bad Request`: malformed query values (if sent incorrectly)

Recommended UI fallback:

- Show inline retry action for request failure.
- Keep previous page data visible while loading next page.
- Display empty state when `audios.length === 0`.
