# Manual Lead Trial Lesson SMS Notification API

This document describes the API endpoint to manually send an SMS reminder to a student about their scheduled trial lesson.

## Endpoint Overview

**URL:** `/lead-trial-lessons/{id}/notify`  
**Method:** `POST`  
**Authentication:** Required (Bearer Token)  
**Roles Required:** `Admin` or `Teacher`

## Description

This endpoint allows administrators and teachers to manually trigger an SMS reminder to a student regarding their trial lesson. It will use the lead's phone number as it appears on the associated lead profile.

## Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid string` | Yes | The ID of the lead trial lesson to send a notification for |

## Response

### Success Response

**Code:** `200 OK`

**Body:**

```json
{
  "success": true,
  "message": "SMS reminder sent successfully"
}
```

### Error Responses

#### Bad Request (400)

Returned when the lead does not have a valid phone number, or the associated lead profile cannot be found.

**Body:**

```json
{
  "message": "Lead does not have a phone number",
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Unauthorized (401)

Returned when the request lacks a valid JWT bearer token.

#### Forbidden (403)

Returned when the authenticated user does not have the `Admin` or `Teacher` role.

#### Not Found (404)

Returned when a trial lesson with the specified `id` does not exist.

## Notes for Frontend Implementation

1. **State Update:** Upon a successful response (`200 OK`), the frontend can safely update the local state of that trial lesson to reflect that `isNotified: true`. The backend automatically sets this flag to true when the manual SMS succeeds.
2. **User Feedback:** Ensure to show a success toast notification if the API succeeds, and an error toast displaying the message returned by the server if it fails (e.g. "Lead does not have a phone number").
