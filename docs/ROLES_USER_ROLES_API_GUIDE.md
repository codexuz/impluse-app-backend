# Roles & User Roles API Guide

## Overview

The Roles & User Roles API provides endpoints for managing application roles (CRUD) and assigning/removing roles from users. All endpoints require **admin** authentication.

**Base URL:** `/users`

**Authentication:** Bearer JWT token (Admin role required)

---

## Data Models

### Role

| Field         | Type      | Description                  |
|---------------|-----------|------------------------------|
| `id`          | `integer` | Auto-incremented primary key |
| `name`        | `string`  | Unique role name             |
| `description` | `string`  | Optional description         |
| `isActive`    | `boolean` | Whether the role is active   |
| `createdAt`   | `date`    | Creation timestamp           |
| `updatedAt`   | `date`    | Last update timestamp        |

### UserRole (join table)

| Field        | Type      | Description                          |
|--------------|-----------|--------------------------------------|
| `userId`     | `UUID`    | Reference to user                    |
| `roleId`     | `integer` | Reference to role                    |
| `assignedAt` | `date`    | When the role was assigned           |
| `expiresAt`  | `date`    | Optional expiration date             |

### Default System Roles

| Name              | Description                |
|-------------------|----------------------------|
| `admin`           | Full system access         |
| `teacher`         | Teacher access             |
| `student`         | Student access             |
| `support_teacher` | Support teacher access     |
| `guest`           | Limited guest access       |

> **Note:** System roles (`admin`, `teacher`, `student`, `support_teacher`, `guest`) cannot be deleted.

---

## Roles CRUD Endpoints

### 1. Get All Roles

**`GET /users/roles`**

#### Success Response (200)

```json
[
  {
    "id": 1,
    "name": "admin",
    "description": "Full system access",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "teacher",
    "description": "Teacher access",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Role by ID

**`GET /users/roles/:id`**

#### Path Parameters

| Param | Type      | Description |
|-------|-----------|-------------|
| `id`  | `integer` | Role ID     |

#### Success Response (200)

```json
{
  "id": 1,
  "name": "admin",
  "description": "Full system access",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### Error Responses

| Status | Description        |
|--------|--------------------|
| `404`  | Role not found     |

---

### 3. Create a Role

**`POST /users/roles`**

#### Request Body

```json
{
  "name": "moderator",
  "description": "Moderator role with limited admin access",
  "isActive": true
}
```

| Field         | Type      | Required | Default | Description          |
|---------------|-----------|----------|---------|----------------------|
| `name`        | `string`  | Yes      | —       | Unique role name     |
| `description` | `string`  | No       | `null`  | Role description     |
| `isActive`    | `boolean` | No       | `true`  | Whether role is active |

#### Success Response (201)

```json
{
  "id": 6,
  "name": "moderator",
  "description": "Moderator role with limited admin access",
  "isActive": true,
  "createdAt": "2026-02-27T10:00:00.000Z",
  "updatedAt": "2026-02-27T10:00:00.000Z"
}
```

#### Error Responses

| Status | Description                          |
|--------|--------------------------------------|
| `409`  | Role with this name already exists   |

---

### 4. Update a Role

**`PATCH /users/roles/:id`**

#### Path Parameters

| Param | Type      | Description |
|-------|-----------|-------------|
| `id`  | `integer` | Role ID     |

#### Request Body (all fields optional)

```json
{
  "name": "senior_moderator",
  "description": "Updated description",
  "isActive": false
}
```

#### Success Response (200)

```json
{
  "id": 6,
  "name": "senior_moderator",
  "description": "Updated description",
  "isActive": false,
  "createdAt": "2026-02-27T10:00:00.000Z",
  "updatedAt": "2026-02-27T11:00:00.000Z"
}
```

#### Error Responses

| Status | Description                          |
|--------|--------------------------------------|
| `404`  | Role not found                       |
| `409`  | Role with this name already exists   |

---

### 5. Delete a Role

**`DELETE /users/roles/:id`**

#### Path Parameters

| Param | Type      | Description |
|-------|-----------|-------------|
| `id`  | `integer` | Role ID     |

#### Success Response (204)

No content.

#### Error Responses

| Status | Description                                                  |
|--------|--------------------------------------------------------------|
| `400`  | Cannot delete protected system role                          |
| `400`  | Cannot delete role — it is assigned to user(s)               |
| `404`  | Role not found                                               |

---

## User Roles Management Endpoints

### 6. Get User's Roles

**`GET /users/:id/roles`**

Returns all roles assigned to a specific user.

#### Path Parameters

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | `UUID` | User ID     |

#### Success Response (200)

```json
[
  {
    "id": 1,
    "name": "admin",
    "description": "Full system access",
    "isActive": true,
    "UserRole": {
      "assignedAt": "2025-06-15T08:30:00.000Z",
      "expiresAt": null
    }
  }
]
```

#### Error Responses

| Status | Description    |
|--------|----------------|
| `404`  | User not found |

---

### 7. Assign a Role to a User

**`POST /users/:id/roles`**

#### Path Parameters

| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | `UUID` | User ID     |

#### Request Body

```json
{
  "roleId": 2,
  "expiresAt": "2027-12-31T23:59:59.000Z"
}
```

| Field       | Type         | Required | Description                            |
|-------------|--------------|----------|----------------------------------------|
| `roleId`    | `integer`    | Yes      | ID of the role to assign               |
| `expiresAt` | `ISO 8601`   | No       | Optional expiration date for the role   |

#### Success Response (201)

```json
{
  "message": "Role \"teacher\" assigned to user successfully"
}
```

#### Error Responses

| Status | Description                  |
|--------|------------------------------|
| `404`  | User not found               |
| `404`  | Role not found               |
| `409`  | User already has this role   |

---

### 8. Remove a Role from a User

**`DELETE /users/:id/roles/:roleId`**

#### Path Parameters

| Param    | Type      | Description     |
|----------|-----------|-----------------|
| `id`     | `UUID`    | User ID         |
| `roleId` | `integer` | Role ID         |

#### Success Response (204)

No content.

#### Error Responses

| Status | Description                          |
|--------|--------------------------------------|
| `404`  | User not found                       |
| `404`  | Role not found                       |
| `404`  | User does not have this role         |

---

## Frontend Implementation Example

```typescript
const API_BASE = "/users";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// ---- Roles CRUD ----

// Get all roles
const roles = await fetch(`${API_BASE}/roles`, { headers }).then((r) => r.json());

// Create a new role
const newRole = await fetch(`${API_BASE}/roles`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "moderator",
    description: "Moderator with limited access",
  }),
}).then((r) => r.json());

// Update a role
await fetch(`${API_BASE}/roles/${roleId}`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ description: "Updated description" }),
});

// Delete a role
await fetch(`${API_BASE}/roles/${roleId}`, {
  method: "DELETE",
  headers,
});

// ---- User Roles ----

// Get a user's roles
const userRoles = await fetch(`${API_BASE}/${userId}/roles`, { headers }).then((r) => r.json());

// Assign a role to a user
await fetch(`${API_BASE}/${userId}/roles`, {
  method: "POST",
  headers,
  body: JSON.stringify({ roleId: 2 }),
}).then((r) => r.json());

// Remove a role from a user
await fetch(`${API_BASE}/${userId}/roles/${roleId}`, {
  method: "DELETE",
  headers,
});
```

---

## Summary

| Method   | Endpoint                     | Description                |
|----------|------------------------------|----------------------------|
| `GET`    | `/users/roles`               | List all roles             |
| `GET`    | `/users/roles/:id`           | Get role by ID             |
| `POST`   | `/users/roles`               | Create a new role          |
| `PATCH`  | `/users/roles/:id`           | Update a role              |
| `DELETE` | `/users/roles/:id`           | Delete a role              |
| `GET`    | `/users/:id/roles`           | Get user's roles           |
| `POST`   | `/users/:id/roles`           | Assign role to user        |
| `DELETE` | `/users/:id/roles/:roleId`   | Remove role from user      |
