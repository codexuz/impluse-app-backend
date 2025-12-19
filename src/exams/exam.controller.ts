import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ExamService } from "./exam.service.js";
import { CreateExamDto } from "./dto/create-exam.dto.js";
import { UpdateExamDto } from "./dto/update-exam.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Exams")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("exams")
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @Roles("admin", "teacher")
  @ApiOperation({ summary: "Create a new exam" })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  @Roles("admin", "teacher")
  @ApiOperation({ summary: "Get all exams" })
  findAll() {
    return this.examService.findAll();
  }

  @Get("user/:userId")
  @Roles("admin", "teacher", "student")
  @ApiOperation({
    summary: "Get exams by user ID (based on user's group memberships)",
  })
  getByUserId(@Param("userId") userId: string) {
    return this.examService.getByUserId(userId);
  }

  @Get("teacher/:teacherId")
  @Roles("admin", "teacher")
  @ApiOperation({
    summary: "Get exams by teacher ID (based on teacher's groups)",
  })
  getByTeacherId(@Param("teacherId") teacherId: string) {
    return this.examService.getByTeacherId(teacherId);
  }

  @Get(":id")
  @Roles("admin", "teacher", "student")
  @ApiOperation({ summary: "Get exam by id" })
  findOne(@Param("id") id: string) {
    return this.examService.findOne(id);
  }

  @Put(":id")
  @Roles("admin", "teacher")
  @ApiOperation({ summary: "Update exam by id" })
  update(@Param("id") id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(":id")
  @Roles("admin", "teacher")
  @ApiOperation({ summary: "Delete exam by id" })
  remove(@Param("id") id: string) {
    return this.examService.remove(id);
  }

  @Get("group/:groupId")
  @Roles("admin", "teacher", "student")
  @ApiOperation({ summary: "Get exams by group id" })
  findByGroup(@Param("groupId") groupId: string) {
    return this.examService.findByGroup(groupId);
  }

  @Get("date-range")
  @Roles("admin", "teacher", "student")
  @ApiOperation({ summary: "Get exams within date range" })
  findByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return this.examService.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Get("status/:status")
  @Roles("admin", "teacher", "student")
  @ApiOperation({ summary: "Get exams by status" })
  findByStatus(@Param("status") status: string) {
    return this.examService.findByStatus(status);
  }

  @Get("level/:level")
  @Roles("admin", "teacher", "student")
  @ApiOperation({ summary: "Get exams by level" })
  findByLevel(@Param("level") level: string) {
    return this.examService.findByLevel(level);
  }
}
