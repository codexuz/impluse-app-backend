# Lead Trial Lessons Module Documentation

## Overview
The Lead Trial Lessons module provides comprehensive CRUD operations for managing trial lessons in the LMS system. It includes proper authentication, role-based authorization, and detailed Swagger API documentation.

## Features
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ JWT Authentication
- ✅ Role-based authorization (Admin, Manager, Teacher)
- ✅ Swagger/OpenAPI documentation
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ Trial lesson statistics
- ✅ Upcoming lessons tracking
- ✅ Soft delete support
- ✅ Input validation
- ✅ Error handling
- ✅ Unit tests

## API Endpoints

### 1. Create Trial Lesson
- **POST** `/lead-trial-lessons`
- **Auth**: Required (Admin, Manager)
- **Description**: Create a new trial lesson
- **Body**: CreateLeadTrialLessonDto

### 2. Get All Trial Lessons
- **GET** `/lead-trial-lessons`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get paginated list of trial lessons with filtering
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search in notes
  - `status` (optional): Filter by status
  - `teacherId` (optional): Filter by teacher ID

### 3. Get Trial Lesson Statistics
- **GET** `/lead-trial-lessons/stats`
- **Auth**: Required (Admin, Manager)
- **Description**: Get trial lesson statistics (total, by status, by teacher, upcoming)

### 4. Get Upcoming Trial Lessons
- **GET** `/lead-trial-lessons/upcoming`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get upcoming scheduled trial lessons
- **Query Parameters**:
  - `limit` (optional): Maximum results (default: 20)

### 5. Get Trial Lessons by Status
- **GET** `/lead-trial-lessons/by-status/:status`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get all trial lessons filtered by specific status

### 6. Get Trial Lessons by Teacher
- **GET** `/lead-trial-lessons/by-teacher/:teacherId`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get all trial lessons assigned to specific teacher

### 7. Get Trial Lessons by Lead
- **GET** `/lead-trial-lessons/by-lead/:leadId`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get all trial lessons for specific lead

### 8. Get My Lessons (Teacher)
- **GET** `/lead-trial-lessons/my-lessons`
- **Auth**: Required (Teacher)
- **Description**: Get trial lessons assigned to current teacher

### 9. Get Trial Lesson by ID
- **GET** `/lead-trial-lessons/:id`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get specific trial lesson by ID

### 10. Update Trial Lesson
- **PATCH** `/lead-trial-lessons/:id`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Update trial lesson information
- **Body**: UpdateLeadTrialLessonDto

### 11. Delete Trial Lesson
- **DELETE** `/lead-trial-lessons/:id`
- **Auth**: Required (Admin, Manager)
- **Description**: Soft delete a trial lesson

## Data Models

### LeadTrialLesson Entity
```typescript
{
  id: string (UUID)
  scheduledAt: Date
  status: TrialLessonStatus (enum)
  teacher_id: string (UUID)
  lead_id: string (UUID)
  notes: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date (soft delete)
}
```

### Trial Lesson Status Enum
- `belgilangan` - Scheduled
- `keldi` - Attended
- `kelmadi` - Did not attend

## DTOs

### CreateLeadTrialLessonDto
All fields required for creating a new trial lesson:
- `scheduledAt`: Date and time for the lesson
- `status`: Trial lesson status
- `teacher_id`: Assigned teacher ID
- `lead_id`: Associated lead ID
- `notes`: Additional notes

### UpdateLeadTrialLessonDto
Partial version of CreateLeadTrialLessonDto for updates.

### TrialLessonResponseDto
Response format for trial lesson data.

### TrialLessonListResponseDto
Response format for paginated trial lesson lists.

### TrialLessonStatsResponseDto
Response format for trial lesson statistics including:
- Total trial lessons
- Count by status
- Count by teacher
- Upcoming lessons count

## Role-Based Access Control

### Admin & Manager
- Full CRUD access
- Can view all trial lessons
- Can view statistics
- Can schedule and manage lessons

### Teacher
- Read and update access
- Can view all trial lessons
- Can view own assigned lessons
- Can update lesson status and notes
- Cannot create or delete lessons

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Role-Based Authorization**: Different permission levels for different roles
3. **Input Validation**: Comprehensive validation using class-validator
4. **Error Handling**: Proper error responses with meaningful messages
5. **Soft Delete**: Trial lessons are soft-deleted (paranoid mode) for data integrity

## Usage Examples

### Create a Trial Lesson
```bash
POST /lead-trial-lessons
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "scheduledAt": "2024-01-20T14:00:00Z",
  "status": "belgilangan",
  "teacher_id": "123e4567-e89b-12d3-a456-426614174000",
  "lead_id": "123e4567-e89b-12d3-a456-426614174001",
  "notes": "Business English trial lesson"
}
```

### Get Trial Lessons with Pagination and Filtering
```bash
GET /lead-trial-lessons?page=1&limit=10&status=belgilangan&teacherId=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt-token>
```

### Update Trial Lesson Status
```bash
PATCH /lead-trial-lessons/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "keldi",
  "notes": "Student attended and showed good progress"
}
```

### Get Upcoming Trial Lessons
```bash
GET /lead-trial-lessons/upcoming?limit=10
Authorization: Bearer <jwt-token>
```

### Get Teacher's Assigned Lessons
```bash
GET /lead-trial-lessons/my-lessons
Authorization: Bearer <jwt-token>
```

## Common Use Cases

### 1. Scheduling Trial Lessons
Admins and managers can schedule trial lessons for leads, assigning specific teachers and time slots.

### 2. Tracking Attendance
Teachers can update lesson status to track whether students attended or not.

### 3. Managing Teacher Schedules
View all lessons assigned to specific teachers to manage workload and scheduling.

### 4. Lead Progress Tracking
Track all trial lessons associated with a specific lead to monitor their journey.

### 5. Upcoming Lesson Management
Get a list of upcoming lessons to prepare and remind participants.

### 6. Performance Analytics
View statistics on trial lesson completion rates, teacher performance, and scheduling patterns.

## Testing
Unit tests are included for the service layer, covering all major functionality:
- Creating trial lessons
- Retrieving lessons with pagination and filtering
- Finding lessons by various criteria (status, teacher, lead)
- Updating lesson information
- Deleting lessons
- Error handling scenarios

Run tests with:
```bash
npm test -- lead-trial-lessons.service.spec.ts
```

## File Structure
```
src/lead-trial-lessons/
├── dto/
│   ├── create-lead-trial-lesson.dto.ts
│   ├── update-lead-trial-lesson.dto.ts
│   └── trial-lesson-response.dto.ts
├── entities/
│   └── lead-trial-lesson.entity.ts
├── test/
│   └── lead-trial-lessons.service.spec.ts
├── lead-trial-lessons.controller.ts
├── lead-trial-lessons.service.ts
└── lead-trial-lessons.module.ts
```

## Dependencies
- `@nestjs/common`
- `@nestjs/sequelize`
- `@nestjs/swagger`
- `class-validator`
- `class-transformer`
- `sequelize`
- Authentication guards and decorators from auth module

## Integration with Other Modules
This module integrates with:
- **Leads Module**: Links trial lessons to specific leads
- **Users Module**: Links trial lessons to teachers
- **Auth Module**: Provides authentication and authorization

## Best Practices
1. Always validate input data using DTOs
2. Use proper error handling with meaningful messages
3. Implement pagination for large datasets
4. Use soft deletes to maintain data integrity
5. Provide comprehensive API documentation
6. Test all endpoints and edge cases
7. Follow RESTful API conventions
8. Use proper HTTP status codes
