import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { SpeechSuperService } from "./speechsuper.service.js";
import { CreateTopicDto } from "./dto/create-topic.dto.js";
import { UpdateTopicDto } from "./dto/update-topic.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { AssessDto } from "./dto/assess.dto.js";

@ApiTags("speechsuper")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("speechsuper")
export class SpeechSuperController {
  constructor(private readonly service: SpeechSuperService) {}

  // ----- Topics -----

  @Post("topics")
  @ApiOperation({ summary: "Create a practice topic" })
  createTopic(@Body() dto: CreateTopicDto) {
    return this.service.createTopic(dto);
  }

  @Get("topics")
  @ApiOperation({ summary: "List active topics" })
  @ApiQuery({ name: "category", required: false, enum: ["ielts", "general", "pronunciation"] })
  findAllTopics(@Query("category") category?: string) {
    return this.service.findAllTopics(category);
  }

  @Get("topics/:id")
  @ApiOperation({ summary: "Get a topic with its questions" })
  @ApiParam({ name: "id" })
  findTopic(@Param("id") id: string) {
    return this.service.findTopicWithQuestions(id);
  }

  @Patch("topics/:id")
  @ApiOperation({ summary: "Update a topic" })
  @ApiParam({ name: "id" })
  updateTopic(@Param("id") id: string, @Body() dto: UpdateTopicDto) {
    return this.service.updateTopic(id, dto);
  }

  @Delete("topics/:id")
  @ApiOperation({ summary: "Delete a topic" })
  @ApiParam({ name: "id" })
  removeTopic(@Param("id") id: string) {
    return this.service.removeTopic(id);
  }

  // ----- Questions -----

  @Post("questions")
  @ApiOperation({ summary: "Create a question in a topic" })
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.service.createQuestion(dto);
  }

  @Get("topics/:topicId/questions")
  @ApiOperation({ summary: "List questions for a topic" })
  @ApiParam({ name: "topicId" })
  findQuestionsByTopic(@Param("topicId") topicId: string) {
    return this.service.findQuestionsByTopic(topicId);
  }

  @Get("questions/:id")
  @ApiOperation({ summary: "Get a question" })
  @ApiParam({ name: "id" })
  findQuestion(@Param("id") id: string) {
    return this.service.findQuestion(id);
  }

  @Patch("questions/:id")
  @ApiOperation({ summary: "Update a question" })
  @ApiParam({ name: "id" })
  updateQuestion(@Param("id") id: string, @Body() dto: UpdateQuestionDto) {
    return this.service.updateQuestion(id, dto);
  }

  @Delete("questions/:id")
  @ApiOperation({ summary: "Delete a question" })
  @ApiParam({ name: "id" })
  removeQuestion(@Param("id") id: string) {
    return this.service.removeQuestion(id);
  }

  // ----- Assessment -----

  @Post("assess")
  @ApiOperation({
    summary: "Assess a student's audio with SpeechSuper",
    description:
      "Send audio as a multipart `audio` file or via `audio_url`. Provide a question_id to assess against a stored question, or part_type + ref_text/prompt directly.",
  })
  @ApiConsumes("multipart/form-data", "application/json")
  @UseInterceptors(
    FileInterceptor("audio", {
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  assess(
    @Body() dto: AssessDto,
    @UploadedFile() audio?: Express.Multer.File,
  ) {
    return this.service.assess(dto, audio?.buffer);
  }

  // ----- Attempts -----

  @Get("attempts/student/:studentId")
  @ApiOperation({ summary: "List a student's attempts" })
  @ApiParam({ name: "studentId" })
  attemptsByStudent(@Param("studentId") studentId: string) {
    return this.service.findAttemptsByStudent(studentId);
  }

  @Get("attempts/question/:questionId")
  @ApiOperation({ summary: "List attempts for a question" })
  @ApiParam({ name: "questionId" })
  @ApiQuery({ name: "studentId", required: false })
  attemptsByQuestion(
    @Param("questionId") questionId: string,
    @Query("studentId") studentId?: string,
  ) {
    return this.service.findAttemptsByQuestion(questionId, studentId);
  }

  @Get("attempts/:id")
  @ApiOperation({ summary: "Get an attempt" })
  @ApiParam({ name: "id" })
  attempt(@Param("id") id: string) {
    return this.service.findAttempt(id);
  }
}
