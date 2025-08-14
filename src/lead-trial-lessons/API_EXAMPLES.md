# Lead Trial Lessons API Examples

## Authentication
All requests require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Example Requests

### 1. Create a Trial Lesson
```bash
curl -X POST http://localhost:3000/lead-trial-lessons \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledAt": "2024-01-25T15:00:00Z",
    "status": "belgilangan",
    "teacher_id": "550e8400-e29b-41d4-a716-446655440000",
    "lead_id": "550e8400-e29b-41d4-a716-446655440001",
    "notes": "Trial lesson for beginner level English"
  }'
```

### 2. Get All Trial Lessons (Paginated)
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons?page=1&limit=10&status=belgilangan" \
  -H "Authorization: Bearer <jwt-token>"
```

### 3. Get Upcoming Trial Lessons
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/upcoming?limit=5" \
  -H "Authorization: Bearer <jwt-token>"
```

### 4. Get Trial Lesson Statistics
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/stats" \
  -H "Authorization: Bearer <jwt-token>"
```

### 5. Get Teacher's Lessons (for teachers)
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/my-lessons" \
  -H "Authorization: Bearer <teacher-jwt-token>"
```

### 6. Update Trial Lesson Status
```bash
curl -X PATCH http://localhost:3000/lead-trial-lessons/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "keldi",
    "notes": "Student attended and was very engaged"
  }'
```

### 7. Get Trial Lessons by Status
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/by-status/keldi" \
  -H "Authorization: Bearer <jwt-token>"
```

### 8. Get Trial Lessons by Teacher
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/by-teacher/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <jwt-token>"
```

### 9. Get Trial Lessons by Lead
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons/by-lead/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer <jwt-token>"
```

### 10. Delete Trial Lesson (Admin/Manager only)
```bash
curl -X DELETE http://localhost:3000/lead-trial-lessons/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <admin-jwt-token>"
```

## Response Examples

### Create Trial Lesson Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "scheduledAt": "2024-01-25T15:00:00Z",
  "status": "belgilangan",
  "teacher_id": "550e8400-e29b-41d4-a716-446655440001",
  "lead_id": "550e8400-e29b-41d4-a716-446655440002",
  "notes": "Trial lesson for beginner level English",
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

### Get All Trial Lessons Response
```json
{
  "trialLessons": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "scheduledAt": "2024-01-25T15:00:00Z",
      "status": "belgilangan",
      "teacher_id": "550e8400-e29b-41d4-a716-446655440001",
      "lead_id": "550e8400-e29b-41d4-a716-446655440002",
      "notes": "Trial lesson for beginner level English",
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 25,
  "totalPages": 3,
  "currentPage": 1
}
```

### Statistics Response
```json
{
  "totalTrialLessons": 50,
  "trialLessonsByStatus": {
    "belgilangan": 20,
    "keldi": 25,
    "kelmadi": 5
  },
  "trialLessonsByTeacher": {
    "550e8400-e29b-41d4-a716-446655440001": 30,
    "550e8400-e29b-41d4-a716-446655440002": 20
  },
  "upcomingTrialLessons": 15
}
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["scheduledAt must be a valid ISO 8601 date string"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin or Manager role required"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Trial lesson with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

## Status Codes Summary

- `200 OK` - Successful GET, PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Filtering and Search

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in notes field
- `status`: Filter by exact status match
- `teacherId`: Filter by teacher ID

### Example with Multiple Filters
```bash
curl -X GET "http://localhost:3000/lead-trial-lessons?page=2&limit=5&status=keldi&teacherId=550e8400-e29b-41d4-a716-446655440001&search=english" \
  -H "Authorization: Bearer <jwt-token>"
```

This will return:
- Page 2 of results
- 5 items per page
- Only lessons with status "keldi"
- Only lessons assigned to the specified teacher
- Only lessons with "english" in the notes
