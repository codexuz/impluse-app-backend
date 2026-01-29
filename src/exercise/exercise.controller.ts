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
  Put,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from "@nestjs/swagger";
import { ExerciseService } from "./exercise.service.js";
import { CreateCompleteExerciseDto } from "./dto/create-complete-exercise.dto.js";
import { UpdateExerciseDto } from "./dto/update-complete-exercise.dto.js";
import { CreateExerciseDto } from "./dto/create-exercise.dto.js";
import { UpdateExerciseDto as UpdateExerciseOnlyDto } from "./dto/update-exercise.dto.js";
import { ExerciseResponseDto } from "./dto/exercise-response.dto.js";
import { Exercise } from "./entities/exercise.entity.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/constants/roles.js";

@ApiTags("Exercises")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("exercise")
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Create a new complete exercise with all question types",
  })
  @ApiResponse({
    status: 201,
    description: "Exercise has been created successfully.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid exercise data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async create(
    @Body() createExerciseDto: CreateCompleteExerciseDto,
  ): Promise<Exercise> {
    return await this.exerciseService.create(createExerciseDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all exercises" })
  @ApiResponse({
    status: 200,
    description: "Return all active exercises.",
    type: [ExerciseResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findAll(): Promise<Exercise[]> {
    return await this.exerciseService.findAll();
  }

  @Get("lesson/:lessonId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all exercises for a lesson" })
  @ApiResponse({
    status: 200,
    description: "Return all exercises for the specified lesson.",
    type: [ExerciseResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByLessonId(
    @Param("lessonId") lessonId: string,
  ): Promise<Exercise[]> {
    return await this.exerciseService.findByLessonId(lessonId);
  }

  @Get("type/:exerciseType")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary:
      "Get exercises by exercise type (grammar, reading, listening, writing)",
  })
  @ApiResponse({
    status: 200,
    description: "Return all exercises of the specified type.",
    type: [ExerciseResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByType(
    @Param("exerciseType") exerciseType: string,
  ): Promise<Exercise[]> {
    return await this.exerciseService.findByType(exerciseType);
  }

  @Get("type/:exerciseType/lesson/:lessonId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get exercises by both exercise type and lesson ID",
  })
  @ApiResponse({
    status: 200,
    description: "Return exercises of the specified type for the given lesson.",
    type: [ExerciseResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByTypeAndLessonId(
    @Param("exerciseType") exerciseType: string,
    @Param("lessonId") lessonId: string,
  ): Promise<Exercise[]> {
    return await this.exerciseService.findByTypeAndLessonId(
      exerciseType,
      lessonId,
    );
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get exercise by id with all related data" })
  @ApiResponse({
    status: 200,
    description: "Return the exercise with all questions and related data.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async findOne(@Param("id") id: string): Promise<Exercise> {
    return await this.exerciseService.findOne(id);
  }

  @Get(":id/questions")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all questions for a specific exercise" })
  @ApiResponse({
    status: 200,
    description: "Return all questions for the specified exercise.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async getQuestionsForExercise(@Param("id") exerciseId: string) {
    return await this.exerciseService.getQuestionsForExercise(exerciseId);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update an exercise with related data" })
  @ApiResponse({
    status: 200,
    description: "Exercise has been updated successfully.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid exercise data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async update(
    @Param("id") id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return await this.exerciseService.update(id, updateExerciseDto);
  }

  @Post("only")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create only the exercise without questions" })
  @ApiResponse({
    status: 201,
    description: "Exercise has been created successfully.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid exercise data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async createExerciseOnly(
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    return await this.exerciseService.createExerciseOnly(createExerciseDto);
  }

  @Patch(":id/only")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Update only the exercise metadata without touching questions",
  })
  @ApiResponse({
    status: 200,
    description: "Exercise has been updated successfully.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid exercise data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async updateExerciseOnly(
    @Param("id") id: string,
    @Body() updateExerciseDto: UpdateExerciseOnlyDto,
  ): Promise<Exercise> {
    return await this.exerciseService.updateExerciseOnly(id, updateExerciseDto);
  }

  @Put(":id/with-questions")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update exercise and add/replace questions" })
  @ApiResponse({
    status: 200,
    description: "Exercise and questions have been updated successfully.",
    type: ExerciseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid exercise data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async updateExerciseWithQuestions(
    @Param("id") id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return await this.exerciseService.updateExerciseWithQuestions(
      id,
      updateExerciseDto,
    );
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Soft delete an exercise (set isActive to false)" })
  @ApiResponse({
    status: 200,
    description: "Exercise has been deleted successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Exercise not found." })
  async remove(@Param("id") id: string): Promise<void> {
    return await this.exerciseService.remove(id);
  }
}
