import { ApiProperty } from '@nestjs/swagger';

export class HomeworkSubmissionSummaryDto {
  @ApiProperty({ description: 'Homework ID' })
  homework_id: string;

  @ApiProperty({ description: 'Student ID' })
  student_id: string;

  @ApiProperty({ description: 'Submission percentage' })
  percentage: number;

  @ApiProperty({ description: 'Submission status', enum: ['passed', 'failed', 'incomplete'] })
  status: string;

  @ApiProperty({ description: 'Submission section', enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'] })
  section: string;
}

export class HomeworkWithStatusDto {
  @ApiProperty({ description: 'Homework ID' })
  id: string;

  @ApiProperty({ description: 'Lesson ID' })
  lesson_id: string;

  @ApiProperty({ description: 'Group ID' })
  group_id: string;

  @ApiProperty({ description: 'Teacher ID' })
  teacher_id: string;

  @ApiProperty({ description: 'Homework title' })
  title: string;

  @ApiProperty({ description: 'Start date' })
  start_date: Date;

  @ApiProperty({ description: 'Deadline' })
  deadline: Date;

  @ApiProperty({ description: 'Associated lesson information' })
  lesson: {
    id: string;
    title: string;
    lesson_number: number;
  };

  @ApiProperty({ description: 'Student submissions for this homework', type: [HomeworkSubmissionSummaryDto] })
  submissions: HomeworkSubmissionSummaryDto[];

  @ApiProperty({ description: 'Number of submissions' })
  submissionCount: number;

  @ApiProperty({ description: 'Whether homework is overdue' })
  isOverdue: boolean;
}

export class StudentHomeworkStatusDto {
  @ApiProperty({ description: 'Student ID' })
  studentId: string;

  @ApiProperty({ description: 'Group ID (optional)' })
  groupId?: string;

  @ApiProperty({ description: 'Summary statistics' })
  summary: {
    total: number;
    finished: number;
    unfinished: number;
    overdue: number;
  };

  @ApiProperty({ description: 'List of finished homeworks', type: [HomeworkWithStatusDto] })
  finishedHomeworks: HomeworkWithStatusDto[];

  @ApiProperty({ description: 'List of unfinished homeworks', type: [HomeworkWithStatusDto] })
  unfinishedHomeworks: HomeworkWithStatusDto[];
}

export class StudentSubmissionStatusDto {
  @ApiProperty({ description: 'Student ID' })
  studentId: string;

  @ApiProperty({ description: 'Student submissions', type: [HomeworkSubmissionSummaryDto] })
  submissions: HomeworkSubmissionSummaryDto[];

  @ApiProperty({ description: 'Whether student finished homework' })
  isFinished: boolean;

  @ApiProperty({ description: 'Number of submissions' })
  submissionCount: number;
}

export class GroupHomeworkStatusDto {
  @ApiProperty({ description: 'Group ID' })
  groupId: string;

  @ApiProperty({ description: 'Number of students in group' })
  studentCount: number;

  @ApiProperty({ description: 'Group summary statistics' })
  summary: {
    totalHomeworks: number;
    overdueHomeworks: number;
  };

  @ApiProperty({ description: 'List of homeworks with student completion status' })
  homeworks: {
    id: string;
    lesson_id: string;
    group_id: string;
    teacher_id: string;
    title: string;
    start_date: Date;
    deadline: Date;
    lesson: {
      id: string;
      title: string;
      lesson_number: number;
    };
    studentSubmissions: StudentSubmissionStatusDto[];
    summary: {
      totalStudents: number;
      finished: number;
      unfinished: number;
      completionRate: string;
    };
    isOverdue: boolean;
  }[];
}

export class OverallHomeworkStatsDto {
  @ApiProperty({ description: 'Group ID (optional)' })
  groupId?: string;

  @ApiProperty({ description: 'Total number of homeworks' })
  totalHomeworks: number;

  @ApiProperty({ description: 'Number of overdue homeworks' })
  overdueHomeworks: number;

  @ApiProperty({ description: 'Number of upcoming homeworks' })
  upcomingHomeworks: number;

  @ApiProperty({ description: 'Number of homeworks without deadline' })
  noDeadlineHomeworks: number;
}
