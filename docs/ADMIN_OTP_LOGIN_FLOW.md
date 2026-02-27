# Admin OTP Login Flow — Frontend Guide

## Overview

Admin login uses a 2-step OTP (One-Time Password) verification flow. After submitting correct credentials, a 6-digit OTP code is sent to the admin's phone via SMS. The admin must enter this code to complete the login.

**Base URL:** `/auth/admin`

---

## Flow Diagram

```
Admin enters         →  POST /admin/login  →  OTP sent via SMS
username & password                              ↓
                                           { otpRequired, otpToken }
                                                 ↓
Admin enters         →  POST /admin/verify-otp  →  Login successful
OTP code                                          { access_token, user }
```

---

## Step 1: Submit Credentials

Submit the admin's username and password. If valid, an OTP code will be sent to the admin's registered phone number.

**`POST /auth/admin/login`**

### Request Body

```json
{
  "username": "admin_user",
  "password": "password123"
}
```

### Success Response (201)

```json
{
  "otpRequired": true,
  "otpToken": "550e8400-e29b-41d4-a716-446655440000",
  "message": "OTP code sent to your phone"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `401`  | Invalid username or password |
| `401`  | Access denied. User is not an admin |
| `400`  | Failed to send OTP. Please try again |

### Notes
- OTP code expires in **3 minutes**
- Previous unused OTP codes for the same user are automatically invalidated
- SMS message format: `Impulse CRMga kirish kodingiz: 123456`
- **Save the `otpToken`** — it is required for Step 2

---

## Step 2: Verify OTP Code

Submit the OTP token from Step 1 along with the 6-digit code received via SMS.

**`POST /auth/admin/verify-otp`**

### Request Body

```json
{
  "otpToken": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

### Success Response (200)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "a1b2c3d4e5f6...",
  "user": {
    "id": "user-uuid",
    "username": "admin_user",
    "phone": "+998901234567",
    "first_name": "Admin",
    "last_name": "User",
    "avatar_url": "https://...",
    "roles": ["admin"]
  },
  "sessionId": "session-uuid",
  "expiresAt": "2026-03-29T12:00:00.000Z",
  "refreshExpiresAt": "2026-04-28T12:00:00.000Z"
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `400`  | Invalid or expired OTP. Please login again. |
| `400`  | Too many attempts. Please login again. |
| `400`  | Invalid OTP code |

### Notes
- Maximum **5 attempts** to enter the correct OTP code
- After 5 failed attempts, the OTP is invalidated and the admin must restart from Step 1
- After the OTP expires (3 minutes), the admin must restart from Step 1
- On success, the response is identical to a normal login response

---

## Frontend Implementation Example

```typescript
// Step 1: Submit credentials
const loginResponse = await fetch('/auth/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});

const { otpRequired, otpToken, message } = await loginResponse.json();

if (otpRequired) {
  // Show OTP input screen to admin
  // Store otpToken for Step 2
}

// Step 2: Verify OTP (after admin enters the code)
const verifyResponse = await fetch('/auth/admin/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ otpToken, code: otpCode }),
});

const { access_token, refresh_token, user, sessionId } = await verifyResponse.json();
// Store tokens and redirect to admin dashboard
```

---

## Security Considerations

| Feature | Detail |
|---------|--------|
| OTP Expiry | 3 minutes |
| Max Attempts | 5 per OTP code |
| OTP Length | 6 digits |
| SMS Delivery | Via Eskiz SMS gateway |
| Previous Codes | Auto-invalidated on new login attempt |
| Token Lifetime | Access: 30 days, Refresh: 60 days |
