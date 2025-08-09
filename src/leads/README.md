# Leads Module Documentation

## Overview
The Leads module provides comprehensive CRUD operations for managing leads in the LMS system. It includes proper authentication, role-based authorization, and detailed Swagger API documentation.

## Features
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ JWT Authentication
- ✅ Role-based authorization (Admin, Manager, Teacher)
- ✅ Swagger/OpenAPI documentation
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ Lead statistics
- ✅ Soft delete support
- ✅ Input validation
- ✅ Error handling
- ✅ Unit tests

## API Endpoints

### 1. Create Lead
- **POST** `/leads`
- **Auth**: Required (Admin, Manager)
- **Description**: Create a new lead
- **Body**: CreateLeadDto

### 2. Get All Leads
- **GET** `/leads`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get paginated list of leads with filtering
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search in name, phone, or question
  - `status` (optional): Filter by status

### 3. Get Lead Statistics
- **GET** `/leads/stats`
- **Auth**: Required (Admin, Manager)
- **Description**: Get lead statistics (total, by status, by source)

### 4. Get Leads by Status
- **GET** `/leads/by-status/:status`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get all leads filtered by specific status

### 5. Get My Leads
- **GET** `/leads/my-leads`
- **Auth**: Required (Admin, Manager)
- **Description**: Get leads assigned to current user

### 6. Get Lead by ID
- **GET** `/leads/:id`
- **Auth**: Required (Admin, Manager, Teacher)
- **Description**: Get specific lead by ID

### 7. Update Lead
- **PATCH** `/leads/:id`
- **Auth**: Required (Admin, Manager)
- **Description**: Update lead information
- **Body**: UpdateLeadDto

### 8. Delete Lead
- **DELETE** `/leads/:id`
- **Auth**: Required (Admin, Manager)
- **Description**: Soft delete a lead

## Data Models

### Lead Entity
```typescript
{
  id: string (UUID)
  phone: string
  question: string
  first_name: string
  last_name: string
  status: LeadStatus (enum)
  source: LeadSource (enum)
  course_id: string (UUID)
  admin_id: string (UUID)
  notes: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date (soft delete)
}
```

### Lead Status Enum
- `Yangi` - New
- `Aloqada` - In Contact
- `Sinovda` - In Trial
- `Sinovda qatnashdi` - Attended Trial
- `Sinovdan ketdi` - Left Trial
- `O'qishga yozildi` - Enrolled
- `Yo'qotildi` - Lost

### Lead Source Enum
- `Instagram`
- `Telegram`
- `Do'stimdan` - From Friend
- `O'zim keldim` - Came Myself
- `Flayer`
- `Banner(yondagi)` - Banner (Nearby)
- `Banner(ko'chadagi)` - Banner (Street)
- `Boshqa` - Other

## DTOs

### CreateLeadDto
All fields required for creating a new lead.

### UpdateLeadDto
Partial version of CreateLeadDto for updates.

### LeadResponseDto
Response format for lead data.

### LeadListResponseDto
Response format for paginated lead lists.

### LeadStatsResponseDto
Response format for lead statistics.

## Role-Based Access Control

### Admin & Manager
- Full CRUD access
- Can view all leads
- Can view statistics
- Can manage own leads

### Teacher
- Read-only access
- Can view all leads
- Can view leads by status
- Cannot create, update, or delete

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Role-Based Authorization**: Different permission levels for different roles
3. **Input Validation**: Comprehensive validation using class-validator
4. **Error Handling**: Proper error responses with meaningful messages
5. **Soft Delete**: Leads are soft-deleted (paranoid mode) for data integrity

## Usage Examples

### Create a Lead
```bash
POST /leads
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "phone": "+998901234567",
  "question": "Ingliz tili kurslari haqida malumot olmoqchiman",
  "first_name": "John",
  "last_name": "Doe",
  "status": "Yangi",
  "source": "Instagram",
  "course_id": "123e4567-e89b-12d3-a456-426614174000",
  "admin_id": "123e4567-e89b-12d3-a456-426614174001",
  "notes": "Kechki darslar qiziqadi"
}
```

### Get Leads with Pagination
```bash
GET /leads?page=1&limit=10&search=John&status=Yangi
Authorization: Bearer <jwt-token>
```

### Update Lead Status
```bash
PATCH /leads/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "Aloqada",
  "notes": "Telefon qilingan, ertaga uchrashish"
}
```

## Testing
Unit tests are included for the service layer, covering all major functionality:
- Creating leads
- Retrieving leads with pagination
- Finding leads by ID
- Updating leads
- Deleting leads
- Error handling scenarios

Run tests with:
```bash
npm test -- leads.service.spec.ts
```

## File Structure
```
src/leads/
├── dto/
│   ├── create-lead.dto.ts
│   ├── update-lead.dto.ts
│   └── lead-response.dto.ts
├── entities/
│   └── lead.entity.ts
├── test/
│   └── leads.service.spec.ts
├── leads.controller.ts
├── leads.service.ts
└── leads.module.ts
```

## Dependencies
- `@nestjs/common`
- `@nestjs/sequelize`
- `@nestjs/swagger`
- `class-validator`
- `class-transformer`
- `sequelize`
- Authentication guards and decorators from auth module
