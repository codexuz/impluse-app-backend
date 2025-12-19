import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { StudentVocabularyProgressService } from "./student-vocabulary-progress.service.js";
import { CreateStudentVocabularyProgressDto } from "./dto/create-student-vocabulary-progress.dto.js";
import { UpdateStudentVocabularyProgressDto } from "./dto/update-student-vocabulary-progress.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { VocabularyProgressStatus } from "./enums/vocabulary-progress-status.enum.js";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Student Vocabulary Progress")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("student-vocabulary-progress")
export class StudentVocabularyProgressController {
  constructor(
    private readonly progressService: StudentVocabularyProgressService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new vocabulary progress record" })
  @ApiResponse({
    status: 201,
    description: "Progress record created successfully",
  })
  create(@Body() createDto: CreateStudentVocabularyProgressDto) {
    return this.progressService.create(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all vocabulary progress records" })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get progress record by id" })
  @ApiParam({ name: "id", description: "Progress record ID" })
  findOne(@Param("id") id: string) {
    return this.progressService.findOne(id);
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all progress records for a student" })
  @ApiParam({ name: "studentId", description: "Student ID" })
  findByStudent(@Param("studentId") studentId: string) {
    return this.progressService.findByStudent(studentId);
  }

  @Get("vocabulary/:vocabularyItemId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all progress records for a vocabulary item" })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  findByVocabularyItem(@Param("vocabularyItemId") vocabularyItemId: string) {
    return this.progressService.findByVocabularyItem(vocabularyItemId);
  }

  @Get("student/:studentId/vocabulary/:vocabularyItemId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get progress record for a specific student and vocabulary item",
  })
  findByStudentAndVocabularyItem(
    @Param("studentId") studentId: string,
    @Param("vocabularyItemId") vocabularyItemId: string
  ) {
    return this.progressService.findByStudentAndVocabularyItem(
      studentId,
      vocabularyItemId
    );
  }

  @Get("student/:studentId/vocabulary/:vocabularyItemId/status")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get word status for a specific student and vocabulary item",
  })
  @ApiParam({ name: "studentId", description: "Student ID" })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the status of the word or null if not found",
  })
  findWordStatus(
    @Param("studentId") studentId: string,
    @Param("vocabularyItemId") vocabularyItemId: string
  ) {
    return this.progressService.findWordStatus(studentId, vocabularyItemId);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Update progress record" })
  @ApiParam({ name: "id", description: "Progress record ID" })
  update(
    @Param("id") id: string,
    @Body() updateDto: UpdateStudentVocabularyProgressDto
  ) {
    return this.progressService.update(id, updateDto);
  }

  @Patch(":id/status/:status")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Update progress status" })
  @ApiParam({ name: "id", description: "Progress record ID" })
  @ApiParam({ name: "status", enum: VocabularyProgressStatus })
  updateStatus(
    @Param("id") id: string,
    @Param("status") status: VocabularyProgressStatus
  ) {
    return this.progressService.updateStatus(id, status);
  }

  @Patch("vocabulary/:vocabularyItemId/status/:status")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Update status for all progress records of a vocabulary item",
  })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  @ApiParam({ name: "status", enum: VocabularyProgressStatus })
  updateStatusByVocabularyItemId(
    @Param("vocabularyItemId") vocabularyItemId: string,
    @Param("status") status: VocabularyProgressStatus
  ) {
    return this.progressService.updateStatusByVocabularyItemId(
      vocabularyItemId,
      status
    );
  }

  @Get("stats/student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get basic vocabulary progress statistics for a student",
  })
  @ApiParam({ name: "studentId", description: "Student ID" })
  getStudentStats(@Param("studentId") studentId: string) {
    return this.progressService.getStudentProgressStats(studentId);
  }

  @Get("stats/student/:studentId/detailed")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get detailed vocabulary progress statistics for a student",
  })
  @ApiParam({ name: "studentId", description: "Student ID" })
  getDetailedStudentStats(@Param("studentId") studentId: string) {
    return this.progressService.getDetailedStudentStats(studentId);
  }

  @Get("stats/vocabulary/:vocabularyItemId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get vocabulary item statistics" })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  getVocabularyItemStats(@Param("vocabularyItemId") vocabularyItemId: string) {
    return this.progressService.getVocabularyItemStats(vocabularyItemId);
  }

  @Get("stats/global")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get global vocabulary progress statistics" })
  getGlobalStats() {
    return this.progressService.getGlobalStats();
  }

  @Get("stats/rankings")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get student rankings based on vocabulary mastery" })
  getStudentRankings(@Query("limit") limitParam?: string) {
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    return this.progressService.getStudentRankings(limit);
  }

  @Get("stats/efficiency-rankings")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary:
      "Get student rankings based on learning efficiency (attempts to mastery)",
  })
  getStudentEfficiencyRankings(@Query("limit") limitParam?: string) {
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    return this.progressService.getStudentEfficiencyRankings(limit);
  }

  @Get("stats/trends")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get vocabulary progress trends over time" })
  getProgressTrends(@Query("days") daysParam?: string) {
    const days = daysParam ? parseInt(daysParam, 10) : 30;
    return this.progressService.getProgressTrends(days);
  }

  @Post(":id/increment-attempts")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Increment attempts count for a progress record" })
  @ApiParam({ name: "id", description: "Progress record ID" })
  incrementAttempts(@Param("id") id: string) {
    return this.progressService.incrementAttempts(id);
  }

  @Post("student/:studentId/vocabulary/:vocabularyItemId/record-attempt")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Record an attempt for a specific student and vocabulary item",
  })
  @ApiParam({ name: "studentId", description: "Student ID" })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  recordAttempt(
    @Param("studentId") studentId: string,
    @Param("vocabularyItemId") vocabularyItemId: string,
    @Query("status") status?: VocabularyProgressStatus
  ) {
    return this.progressService.recordAttempt(
      studentId,
      vocabularyItemId,
      status
    );
  }

  @Post("student/:studentId/vocabulary/:vocabularyItemId/progress")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Progress vocabulary status logically (learning → reviewing → mastered) and increment attempts",
  })
  @ApiParam({ name: "studentId", description: "Student ID" })
  @ApiParam({ name: "vocabularyItemId", description: "Vocabulary Item ID" })
  @ApiResponse({
    status: 200,
    description: "Returns the updated progress record with new status",
  })
  progressVocabularyStatus(
    @Param("studentId") studentId: string,
    @Param("vocabularyItemId") vocabularyItemId: string
  ) {
    return this.progressService.progressVocabularyStatus(
      studentId,
      vocabularyItemId
    );
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete progress record" })
  @ApiParam({ name: "id", description: "Progress record ID" })
  remove(@Param("id") id: string) {
    return this.progressService.remove(id);
  }
}
