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
export class HomeworkSubmissionSummaryDto {
}
__decorate([
    ApiProperty({ description: 'Homework ID' }),
    __metadata("design:type", String)
], HomeworkSubmissionSummaryDto.prototype, "homework_id", void 0);
__decorate([
    ApiProperty({ description: 'Student ID' }),
    __metadata("design:type", String)
], HomeworkSubmissionSummaryDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({ description: 'Submission percentage' }),
    __metadata("design:type", Number)
], HomeworkSubmissionSummaryDto.prototype, "percentage", void 0);
__decorate([
    ApiProperty({ description: 'Submission status', enum: ['passed', 'failed', 'incomplete'] }),
    __metadata("design:type", String)
], HomeworkSubmissionSummaryDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ description: 'Submission section', enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'] }),
    __metadata("design:type", String)
], HomeworkSubmissionSummaryDto.prototype, "section", void 0);
export class HomeworkWithStatusDto {
}
__decorate([
    ApiProperty({ description: 'Homework ID' }),
    __metadata("design:type", String)
], HomeworkWithStatusDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Lesson ID' }),
    __metadata("design:type", String)
], HomeworkWithStatusDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({ description: 'Group ID' }),
    __metadata("design:type", String)
], HomeworkWithStatusDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({ description: 'Teacher ID' }),
    __metadata("design:type", String)
], HomeworkWithStatusDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({ description: 'Homework title' }),
    __metadata("design:type", String)
], HomeworkWithStatusDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ description: 'Start date' }),
    __metadata("design:type", Date)
], HomeworkWithStatusDto.prototype, "start_date", void 0);
__decorate([
    ApiProperty({ description: 'Deadline' }),
    __metadata("design:type", Date)
], HomeworkWithStatusDto.prototype, "deadline", void 0);
__decorate([
    ApiProperty({ description: 'Associated lesson information' }),
    __metadata("design:type", Object)
], HomeworkWithStatusDto.prototype, "lesson", void 0);
__decorate([
    ApiProperty({ description: 'Student submissions for this homework', type: [HomeworkSubmissionSummaryDto] }),
    __metadata("design:type", Array)
], HomeworkWithStatusDto.prototype, "submissions", void 0);
__decorate([
    ApiProperty({ description: 'Number of submissions' }),
    __metadata("design:type", Number)
], HomeworkWithStatusDto.prototype, "submissionCount", void 0);
__decorate([
    ApiProperty({ description: 'Whether homework is overdue' }),
    __metadata("design:type", Boolean)
], HomeworkWithStatusDto.prototype, "isOverdue", void 0);
export class StudentHomeworkStatusDto {
}
__decorate([
    ApiProperty({ description: 'Student ID' }),
    __metadata("design:type", String)
], StudentHomeworkStatusDto.prototype, "studentId", void 0);
__decorate([
    ApiProperty({ description: 'Group ID (optional)' }),
    __metadata("design:type", String)
], StudentHomeworkStatusDto.prototype, "groupId", void 0);
__decorate([
    ApiProperty({ description: 'Summary statistics' }),
    __metadata("design:type", Object)
], StudentHomeworkStatusDto.prototype, "summary", void 0);
__decorate([
    ApiProperty({ description: 'List of finished homeworks', type: [HomeworkWithStatusDto] }),
    __metadata("design:type", Array)
], StudentHomeworkStatusDto.prototype, "finishedHomeworks", void 0);
__decorate([
    ApiProperty({ description: 'List of unfinished homeworks', type: [HomeworkWithStatusDto] }),
    __metadata("design:type", Array)
], StudentHomeworkStatusDto.prototype, "unfinishedHomeworks", void 0);
export class StudentSubmissionStatusDto {
}
__decorate([
    ApiProperty({ description: 'Student ID' }),
    __metadata("design:type", String)
], StudentSubmissionStatusDto.prototype, "studentId", void 0);
__decorate([
    ApiProperty({ description: 'Student submissions', type: [HomeworkSubmissionSummaryDto] }),
    __metadata("design:type", Array)
], StudentSubmissionStatusDto.prototype, "submissions", void 0);
__decorate([
    ApiProperty({ description: 'Whether student finished homework' }),
    __metadata("design:type", Boolean)
], StudentSubmissionStatusDto.prototype, "isFinished", void 0);
__decorate([
    ApiProperty({ description: 'Number of submissions' }),
    __metadata("design:type", Number)
], StudentSubmissionStatusDto.prototype, "submissionCount", void 0);
export class GroupHomeworkStatusDto {
}
__decorate([
    ApiProperty({ description: 'Group ID' }),
    __metadata("design:type", String)
], GroupHomeworkStatusDto.prototype, "groupId", void 0);
__decorate([
    ApiProperty({ description: 'Number of students in group' }),
    __metadata("design:type", Number)
], GroupHomeworkStatusDto.prototype, "studentCount", void 0);
__decorate([
    ApiProperty({ description: 'Group summary statistics' }),
    __metadata("design:type", Object)
], GroupHomeworkStatusDto.prototype, "summary", void 0);
__decorate([
    ApiProperty({ description: 'List of homeworks with student completion status' }),
    __metadata("design:type", Array)
], GroupHomeworkStatusDto.prototype, "homeworks", void 0);
export class OverallHomeworkStatsDto {
}
__decorate([
    ApiProperty({ description: 'Group ID (optional)' }),
    __metadata("design:type", String)
], OverallHomeworkStatsDto.prototype, "groupId", void 0);
__decorate([
    ApiProperty({ description: 'Total number of homeworks' }),
    __metadata("design:type", Number)
], OverallHomeworkStatsDto.prototype, "totalHomeworks", void 0);
__decorate([
    ApiProperty({ description: 'Number of overdue homeworks' }),
    __metadata("design:type", Number)
], OverallHomeworkStatsDto.prototype, "overdueHomeworks", void 0);
__decorate([
    ApiProperty({ description: 'Number of upcoming homeworks' }),
    __metadata("design:type", Number)
], OverallHomeworkStatsDto.prototype, "upcomingHomeworks", void 0);
__decorate([
    ApiProperty({ description: 'Number of homeworks without deadline' }),
    __metadata("design:type", Number)
], OverallHomeworkStatsDto.prototype, "noDeadlineHomeworks", void 0);
//# sourceMappingURL=homework-status-response.dto.js.map