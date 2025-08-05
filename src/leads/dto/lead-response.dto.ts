import { ApiProperty } from '@nestjs/swagger';

export class LeadResponseDto {
  @ApiProperty({
    description: 'Lead ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Lead phone number',
    example: '+998901234567'
  })
  phone: string;

  @ApiProperty({
    description: 'Lead question or inquiry',
    example: 'Ingliz tili kurslari haqida malumot olmoqchiman'
  })
  question: string;

  @ApiProperty({
    description: 'Lead first name',
    example: 'John'
  })
  first_name: string;

  @ApiProperty({
    description: 'Lead last name',
    example: 'Doe'
  })
  last_name: string;

  @ApiProperty({
    description: 'Lead status',
    example: 'Yangi'
  })
  status: string;

  @ApiProperty({
    description: 'Lead source',
    example: 'Instagram'
  })
  source: string;

  @ApiProperty({
    description: 'Course ID the lead is interested in',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  course_id: string;

  @ApiProperty({
    description: 'Admin ID who created the lead',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  admin_id: string;

  @ApiProperty({
    description: 'Additional notes about the lead',
    example: 'Called at 2pm, interested in evening classes'
  })
  notes: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T15:45:00Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date (for soft delete)',
    example: null,
    required: false
  })
  deletedAt?: Date;
}

export class LeadListResponseDto {
  @ApiProperty({
    description: 'Array of leads',
    type: [LeadResponseDto]
  })
  leads: LeadResponseDto[];

  @ApiProperty({
    description: 'Total number of leads',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  currentPage: number;
}

export class LeadStatsResponseDto {
  @ApiProperty({
    description: 'Total number of leads',
    example: 150
  })
  totalLeads: number;

  @ApiProperty({
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
  })
  leadsByStatus: { [key: string]: number };

  @ApiProperty({
    description: 'Number of leads by source',
    example: {
      'Instagram': 50,
      'Telegram': 40,
      "Do'stimdan": 30,
      "O'zim keldim": 20,
      'Flayer': 10
    }
  })
  leadsBySource: { [key: string]: number };
}
