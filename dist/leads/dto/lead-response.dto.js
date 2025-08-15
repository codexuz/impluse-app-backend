var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
export class LeadResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Lead ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Lead phone number',
        example: '+998901234567'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({
        description: 'Lead question or inquiry',
        example: 'Ingliz tili kurslari haqida malumot olmoqchiman'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "question", void 0);
__decorate([
    ApiProperty({
        description: 'Lead first name',
        example: 'John'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "first_name", void 0);
__decorate([
    ApiProperty({
        description: 'Lead last name',
        example: 'Doe'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "last_name", void 0);
__decorate([
    ApiProperty({
        description: 'Lead status',
        example: 'Yangi'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Lead source',
        example: 'Instagram'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "source", void 0);
__decorate([
    ApiProperty({
        description: 'Course ID the lead is interested in',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "course_id", void 0);
__decorate([
    ApiProperty({
        description: 'Admin ID who created the lead',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "admin_id", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes about the lead',
        example: 'Called at 2pm, interested in evening classes'
    }),
    __metadata("design:type", String)
], LeadResponseDto.prototype, "notes", void 0);
__decorate([
    ApiProperty({
        description: 'Creation date',
        example: '2024-01-15T10:30:00Z'
    }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({
        description: 'Last update date',
        example: '2024-01-15T15:45:00Z'
    }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "updatedAt", void 0);
__decorate([
    ApiProperty({
        description: 'Deletion date (for soft delete)',
        example: null,
        required: false
    }),
    __metadata("design:type", Date)
], LeadResponseDto.prototype, "deletedAt", void 0);
export class LeadListResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Array of leads',
        type: [LeadResponseDto]
    }),
    __metadata("design:type", Array)
], LeadListResponseDto.prototype, "leads", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of leads',
        example: 150
    }),
    __metadata("design:type", Number)
], LeadListResponseDto.prototype, "total", void 0);
__decorate([
    ApiProperty({
        description: 'Total number of pages',
        example: 15
    }),
    __metadata("design:type", Number)
], LeadListResponseDto.prototype, "totalPages", void 0);
__decorate([
    ApiProperty({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], LeadListResponseDto.prototype, "currentPage", void 0);
export class LeadStatsResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Total number of leads',
        example: 150
    }),
    __metadata("design:type", Number)
], LeadStatsResponseDto.prototype, "totalLeads", void 0);
__decorate([
    ApiProperty({
        description: 'Number of leads by status',
        example: {
            'Yangi': 45,
            'Aloqada': 30,
            'Sinovda': 25,
            'Sinovda qatnashdi': 20,
            'Sinovdan ketdi': 15,
            "O'qishga yozildi": 10,
            "Yo'qotildi": 5
        }
    }),
    __metadata("design:type", Object)
], LeadStatsResponseDto.prototype, "leadsByStatus", void 0);
__decorate([
    ApiProperty({
        description: 'Number of leads by source',
        example: {
            'Instagram': 50,
            'Telegram': 40,
            "Do'stimdan": 30,
            "O'zim keldim": 20,
            'Flayer': 10
        }
    }),
    __metadata("design:type", Object)
], LeadStatsResponseDto.prototype, "leadsBySource", void 0);
__decorate([
    ApiProperty({
        description: 'Lead trends over time',
        example: {
            daily: [
                { date: '2025-07-15', count: 5 },
                { date: '2025-07-16', count: 8 },
                { date: '2025-07-17', count: 6 }
            ],
            weekly: [
                { week: '2025-07-01', count: 25 },
                { week: '2025-07-08', count: 32 },
                { week: '2025-07-15', count: 28 }
            ],
            monthly: [
                { month: '2025-05-01', count: 95 },
                { month: '2025-06-01', count: 120 },
                { month: '2025-07-01', count: 85 }
            ]
        }
    }),
    __metadata("design:type", Object)
], LeadStatsResponseDto.prototype, "trendsData", void 0);
__decorate([
    ApiProperty({
        description: 'Conversion rates from leads to enrolled students',
        example: {
            overall: 23.5,
            bySource: [
                { source: 'Instagram', rate: 25.3 },
                { source: 'Telegram', rate: 18.7 },
                { source: "Do'stimdan", rate: 32.4 }
            ],
            byStatus: [
                { fromStatus: 'Yangi', toStatus: 'Aloqada', count: 40 },
                { fromStatus: 'Aloqada', toStatus: 'Sinovda', count: 30 },
                { fromStatus: 'Sinovda', toStatus: 'Sinovda qatnashdi', count: 25 }
            ]
        }
    }),
    __metadata("design:type", Object)
], LeadStatsResponseDto.prototype, "conversionRates", void 0);
__decorate([
    ApiProperty({
        description: 'Admin performance statistics',
        example: [
            { adminId: '123e4567-e89b-12d3-a456-426614174000', leadsCount: 50, convertedCount: 15, conversionRate: 30.0 },
            { adminId: '223e4567-e89b-12d3-a456-426614174001', leadsCount: 45, convertedCount: 10, conversionRate: 22.2 }
        ]
    }),
    __metadata("design:type", Array)
], LeadStatsResponseDto.prototype, "adminPerformance", void 0);
__decorate([
    ApiProperty({
        description: 'Average time (in days) leads spend in each status',
        example: [
            { status: 'Yangi', averageDays: 2.5 },
            { status: 'Aloqada', averageDays: 4.2 },
            { status: 'Sinovda', averageDays: 7.1 }
        ]
    }),
    __metadata("design:type", Array)
], LeadStatsResponseDto.prototype, "averageTimeInStatus", void 0);
//# sourceMappingURL=lead-response.dto.js.map