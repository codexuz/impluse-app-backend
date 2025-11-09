import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { HomeworkSubmissionsService } from "./homework_submissions.service.js";
import { CreateHomeworkSubmissionDto } from "./dto/create-homework-submission.dto.js";
import { UpdateHomeworkSubmissionDto } from "./dto/update-homework-submission.dto.js";
import { UpdateHomeworkSectionDto } from "./dto/update-homework-section.dto.js";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import {
  HomeworkSubmissionResponseDto,
  HomeworkSectionResponseDto,
  HomeworkSubmissionWithSectionResponseDto,
} from "./dto/homework-submission-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/constants/roles.js";

@ApiTags("Homework Submissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("homework-submissions")
export class HomeworkSubmissionsController {
  constructor(
    private readonly homeworkSubmissionsService: HomeworkSubmissionsService
  ) {}

  @Post()
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Create a new homework submission" })
  @ApiResponse({
    status: 201,
    description: "The homework submission has been successfully created.",
    type: HomeworkSubmissionWithSectionResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async create(
    @Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto
  ): Promise<HomeworkSubmissionWithSectionResponseDto> {
    return await this.homeworkSubmissionsService.create(
      createHomeworkSubmissionDto
    );
  }

  @Post("section")
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary:
      "Save homework submission by section (creates new or updates existing)",
  })
  @ApiResponse({
    status: 201,
    description: "The homework submission has been successfully saved.",
    type: HomeworkSubmissionWithSectionResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async saveBySection(
    @Body() createHomeworkSubmissionDto: CreateHomeworkSubmissionDto
  ): Promise<HomeworkSubmissionWithSectionResponseDto> {
    return await this.homeworkSubmissionsService.saveBySection(
      createHomeworkSubmissionDto
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all homework submissions" })
  @ApiResponse({
    status: 200,
    description: "Return all homework submissions.",
    type: [HomeworkSubmissionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findAll(): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionsService.findAll();
  }

  @Get("homework/:homeworkId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all submissions for a specific homework" })
  @ApiResponse({
    status: 200,
    description: "Return all submissions for the homework.",
    type: [HomeworkSubmission],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByHomework(
    @Param("homeworkId") homeworkId: string
  ): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionsService.findByHomeworkId(homeworkId);
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all submissions by a specific student" })
  @ApiResponse({
    status: 200,
    description: "Return all submissions by the student.",
    type: [HomeworkSubmission],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByStudent(
    @Param("studentId") studentId: string
  ): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionsService.findByStudentId(studentId);
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Get all submissions by students in a specific group",
  })
  @ApiResponse({
    status: 200,
    description: "Return all submissions by students in the group.",
    type: [HomeworkSubmission],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async findByGroup(
    @Param("groupId") groupId: string
  ): Promise<HomeworkSubmission[]> {
    return await this.homeworkSubmissionsService.findHomeworksByGroupId(
      groupId
    );
  }

  @Get("student/:studentId/homework/:homeworkId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get a specific submission by student and homework",
  })
  @ApiResponse({
    status: 200,
    description: "Return the submission.",
    type: HomeworkSubmission,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async findByStudentAndHomework(
    @Param("studentId") studentId: string,
    @Param("homeworkId") homeworkId: string
  ): Promise<HomeworkSubmission> {
    return await this.homeworkSubmissionsService.findByStudentAndHomework(
      studentId,
      homeworkId
    );
  }

  @Get("section/:section")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all submissions by section" })
  @ApiResponse({
    status: 200,
    description: "Return all submissions for the specified section.",
    type: [HomeworkSectionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findBySection(
    @Param("section") section: string
  ): Promise<HomeworkSection[]> {
    return await this.homeworkSubmissionsService.findBySection(section);
  }

  @Get("student/:studentId/section/:section")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all submissions by student and section" })
  @ApiResponse({
    status: 200,
    description:
      "Return all submissions by the student for the specified section.",
    type: [HomeworkSectionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByStudentAndSection(
    @Param("studentId") studentId: string,
    @Param("section") section: string
  ): Promise<HomeworkSection[]> {
    return await this.homeworkSubmissionsService.findByStudentAndSection(
      studentId,
      section
    );
  }

  @Get("homework/:homeworkId/section/:section")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all submissions by homework and section" })
  @ApiResponse({
    status: 200,
    description: "Return all submissions for the homework and section.",
    type: [HomeworkSectionResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByHomeworkAndSection(
    @Param("homeworkId") homeworkId: string,
    @Param("section") section: string
  ): Promise<HomeworkSection[]> {
    return await this.homeworkSubmissionsService.findByHomeworkAndSection(
      homeworkId,
      section
    );
  }

  @Get("student/:studentId/homework/:homeworkId/section/:section")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get specific submission by student, homework, and section",
  })
  @ApiResponse({
    status: 200,
    description: "Return the submission.",
    type: HomeworkSectionResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async findByStudentHomeworkAndSection(
    @Param("studentId") studentId: string,
    @Param("homeworkId") homeworkId: string,
    @Param("section") section: string
  ): Promise<HomeworkSection> {
    return await this.homeworkSubmissionsService.findByStudentHomeworkAndSection(
      studentId,
      homeworkId,
      section
    );
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a homework submission by id" })
  @ApiResponse({
    status: 200,
    description: "Return the homework submission.",
    type: HomeworkSubmission,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async findOne(@Param("id") id: string): Promise<HomeworkSubmission> {
    return await this.homeworkSubmissionsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Update a homework submission" })
  @ApiResponse({
    status: 200,
    description: "The submission has been successfully updated.",
    type: HomeworkSubmission,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async update(
    @Param("id") id: string,
    @Body() updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto
  ): Promise<HomeworkSubmission> {
    return await this.homeworkSubmissionsService.update(
      id,
      updateHomeworkSubmissionDto
    );
  }

  @Patch(":id/feedback")
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: "Add/Update feedback for a homework submission" })
  @ApiResponse({
    status: 200,
    description: "The feedback has been successfully updated.",
    type: HomeworkSubmission,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async updateFeedback(
    @Param("id") id: string,
    @Body("feedback") feedback: string
  ): Promise<HomeworkSubmission> {
    return await this.homeworkSubmissionsService.updateFeedback(id, feedback);
  }

  @Patch(":id/status")
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: "Update the status of a homework submission" })
  @ApiResponse({
    status: 200,
    description: "The status has been successfully updated.",
    type: HomeworkSubmission,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string
  ): Promise<HomeworkSubmission> {
    return await this.homeworkSubmissionsService.updateStatus(id, status);
  }

  @Patch("sections/:sectionId")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Update a homework section",
    description:
      "Update section score, answers, or speaking_id. Automatically updates lesson progress if passing score (>=60).",
  })
  @ApiResponse({
    status: 200,
    description: "The section has been successfully updated.",
    type: HomeworkSectionResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Section not found." })
  async updateSection(
    @Param("sectionId") sectionId: string,
    @Body() updateData: UpdateHomeworkSectionDto
  ): Promise<HomeworkSection> {
    return await this.homeworkSubmissionsService.updateSection(
      sectionId,
      updateData
    );
  }

  @Post("sections/:sectionId/check-writing")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Check writing answers using AI writing assessment",
    description:
      "Uses OpenAI writing checker bot to assess student's writing, provides feedback in Uzbek, and updates the score automatically.",
  })
  @ApiResponse({
    status: 200,
    description: "Writing has been successfully assessed and scored.",
    type: HomeworkSectionResponseDto,
    schema: {
      example: {
        id: "section-123",
        score: 75,
        answers: {
          writing: "Student's writing response...",
          assessment: {
            score: 75,
            grammarScore: 70,
            vocabularyScore: 80,
            coherenceScore: 75,
            taskResponseScore: 80,
            grammarFeedback: "Grammatika bo'yicha maslahatlar...",
            vocabularyFeedback: "Lug'at boyligi bo'yicha...",
            overallFeedback: "Umumiy baho va tavsiyalar...",
            correctedText: "Corrected version...",
            assessedAt: "2025-11-04T10:30:00.000Z",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid section type or no writing content found.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Section not found." })
  async checkWritingAnswers(
    @Param("sectionId") sectionId: string,
    @Query("taskType") taskType?: string
  ): Promise<HomeworkSection> {
    return await this.homeworkSubmissionsService.checkWritingAnswers(
      sectionId,
      taskType
    );
  }

  @Post("sections/bulk-check-writing")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Bulk check writing answers for multiple sections",
    description:
      "Processes multiple writing sections at once using AI assessment. Returns success/failure status for each section.",
  })
  @ApiResponse({
    status: 200,
    description: "Bulk writing assessment completed.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sectionId: { type: "string" },
          success: { type: "boolean" },
          section: { $ref: "#/components/schemas/HomeworkSectionResponseDto" },
          error: { type: "string" },
        },
      },
      example: [
        {
          sectionId: "section-1",
          success: true,
          section: {
            /* assessed section data */
          },
        },
        {
          sectionId: "section-2",
          success: false,
          error: "No writing content found",
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async bulkCheckWritingAnswers(
    @Body() requestBody: { sectionIds: string[]; taskType?: string }
  ): Promise<
    Array<{
      sectionId: string;
      success: boolean;
      section?: HomeworkSection;
      error?: string;
    }>
  > {
    return await this.homeworkSubmissionsService.bulkCheckWritingAnswers(
      requestBody.sectionIds,
      requestBody.taskType
    );
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a homework submission" })
  @ApiResponse({
    status: 200,
    description: "The submission has been successfully deleted.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Submission not found." })
  async remove(@Param("id") id: string): Promise<void> {
    return await this.homeworkSubmissionsService.remove(id);
  }

  @Get("student/:studentId/homework/:homeworkId/exercises")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get exercises with scores by student ID and homework ID",
    description:
      'Optional "section" query parameter can be used to filter by section type (reading, listening, grammar, writing, speaking)',
  })
  @ApiResponse({
    status: 200,
    description: "Return exercises with scores and completion status.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async getExercisesWithScores(
    @Param("studentId") studentId: string,
    @Param("homeworkId") homeworkId: string,
    @Query("section") section?: string
  ): Promise<any[]> {
    return await this.homeworkSubmissionsService.getExercisesWithScoresByStudentAndHomework(
      studentId,
      homeworkId,
      section
    );
  }

  @Get("student/:studentId/stats")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary:
      "Get student's homework statistics average by section type for all time",
    description:
      "Returns comprehensive homework statistics across all sections for the entire history of the student",
  })
  @ApiResponse({
    status: 200,
    description: "Return homework statistics with averages by section.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async getStudentHomeworkStats(
    @Param("studentId") studentId: string
  ): Promise<any> {
    return await this.homeworkSubmissionsService.getStudentHomeworkStatsBySection(
      studentId
    );
  }

  @Get("student/:studentId/average-speaking-score")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get student's average speaking score across all speaking tasks",
    description:
      "Calculates the average pronunciation score from all speaking responses submitted by the student",
  })
  @ApiResponse({
    status: 200,
    description: "Return the average speaking score.",
    type: Number,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async getStudentAverageSpeakingScore(
    @Param("studentId") studentId: string
  ): Promise<number> {
    return await this.homeworkSubmissionsService.getStudentAverageSpeakingScore(
      studentId
    );
  }

  @Get("speaking/:speakingId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get homework sections by speaking exercise ID",
    description:
      "Returns homework sections with answers for a specific speaking exercise",
  })
  @ApiResponse({
    status: 200,
    description: "Return speaking answers and submissions.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async getHomeworkSectionsBySpeaking(
    @Param("speakingId") speakingId: string,
    @Query("studentId") studentId?: string
  ): Promise<any[]> {
    return await this.homeworkSubmissionsService.getHomeworkSectionsBySpeakingId(
      speakingId,
      studentId
    );
  }
}
