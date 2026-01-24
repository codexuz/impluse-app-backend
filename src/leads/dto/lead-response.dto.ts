import { ApiProperty } from "@nestjs/swagger";

export class LeadResponseDto {
  @ApiProperty({
    description: "Lead ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Lead phone number",
    example: "+998901234567",
  })
  phone: string;

  @ApiProperty({
    description: "Lead phone number",
    example: "+998901234567",
    required: false,
  })
  phone_number: string;

  @ApiProperty({
    description: "Additional phone number",
    example: "+998901234568",
    required: false,
  })
  additional_number: string;

  @ApiProperty({
    description: "Lead question or inquiry",
    example: "Ingliz tili kurslari haqida malumot olmoqchiman",
  })
  question: string;

  @ApiProperty({
    description: "Lead first name",
    example: "John",
  })
  first_name: string;

  @ApiProperty({
    description: "Lead last name",
    example: "Doe",
  })
  last_name: string;

  @ApiProperty({
    description: "Lead status",
    example: "Yangi",
  })
  status: string;

  @ApiProperty({
    description: "Lead source",
    example: "Instagram",
  })
  source: string;

  @ApiProperty({
    description: "Course ID the lead is interested in",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  course_id: string;

  @ApiProperty({
    description: "Admin ID who created the lead",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  admin_id: string;

  @ApiProperty({
    description: "Additional notes about the lead",
    example: "Called at 2pm, interested in evening classes",
  })
  notes: string;

  @ApiProperty({
    description: "Creation date",
    example: "2024-01-15T10:30:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Last update date",
    example: "2024-01-15T15:45:00Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Deletion date (for soft delete)",
    example: null,
    required: false,
  })
  deletedAt?: Date;
}

export class LeadListResponseDto {
  @ApiProperty({
    description: "Array of leads",
    type: [LeadResponseDto],
  })
  leads: LeadResponseDto[];

  @ApiProperty({
    description: "Total number of leads",
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  currentPage: number;
}

export class LeadStatsResponseDto {
  @ApiProperty({
    description: "Total number of leads",
    example: 150,
  })
  totalLeads: number;

  @ApiProperty({
    description: "Number of leads by status",
    example: {
      Yangi: 45,
      Aloqada: 30,
      Sinovda: 25,
      "Sinovda qatnashdi": 20,
      "Sinovdan ketdi": 15,
      "O'qishga yozildi": 10,
      "Yo'qotildi": 5,
    },
  })
  leadsByStatus: { [key: string]: number };

  @ApiProperty({
    description: "Number of leads by source",
    example: {
      Instagram: 50,
      Telegram: 40,
      "Do'stimdan": 30,
      "O'zim keldim": 20,
      Flayer: 10,
    },
  })
  leadsBySource: { [key: string]: number };

  @ApiProperty({
    description: "Lead trends over time",
    example: {
      daily: [
        { date: "2025-07-15", count: 5 },
        { date: "2025-07-16", count: 8 },
        { date: "2025-07-17", count: 6 },
      ],
      weekly: [
        { week: "2025-07-01", count: 25 },
        { week: "2025-07-08", count: 32 },
        { week: "2025-07-15", count: 28 },
      ],
      monthly: [
        { month: "2025-05-01", count: 95 },
        { month: "2025-06-01", count: 120 },
        { month: "2025-07-01", count: 85 },
      ],
    },
  })
  trendsData: {
    daily: { date: string; count: number }[];
    weekly: { week: string; count: number }[];
    monthly: { month: string; count: number }[];
  };

  @ApiProperty({
    description: "Conversion rates from leads to enrolled students",
    example: {
      overall: 23.5,
      bySource: [
        { source: "Instagram", rate: 25.3 },
        { source: "Telegram", rate: 18.7 },
        { source: "Do'stimdan", rate: 32.4 },
      ],
      byStatus: [
        { fromStatus: "Yangi", toStatus: "Aloqada", count: 40 },
        { fromStatus: "Aloqada", toStatus: "Sinovda", count: 30 },
        { fromStatus: "Sinovda", toStatus: "Sinovda qatnashdi", count: 25 },
      ],
    },
  })
  conversionRates: {
    overall: number;
    bySource: { source: string; rate: number }[];
    byStatus: { fromStatus: string; toStatus: string; count: number }[];
  };

  @ApiProperty({
    description: "Admin performance statistics",
    example: [
      {
        adminId: "123e4567-e89b-12d3-a456-426614174000",
        leadsCount: 50,
        convertedCount: 15,
        conversionRate: 30.0,
      },
      {
        adminId: "223e4567-e89b-12d3-a456-426614174001",
        leadsCount: 45,
        convertedCount: 10,
        conversionRate: 22.2,
      },
    ],
  })
  adminPerformance: {
    adminId: string;
    leadsCount: number;
    convertedCount: number;
    conversionRate: number;
  }[];

  @ApiProperty({
    description: "Average time (in days) leads spend in each status",
    example: [
      { status: "Yangi", averageDays: 2.5 },
      { status: "Aloqada", averageDays: 4.2 },
      { status: "Sinovda", averageDays: 7.1 },
    ],
  })
  averageTimeInStatus: { status: string; averageDays: number }[];
}
