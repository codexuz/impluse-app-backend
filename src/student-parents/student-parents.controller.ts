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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { StudentParentsService } from "./student-parents.service.js";
import { CreateStudentParentDto } from "./dto/create-student-parent.dto.js";
import { UpdateStudentParentDto } from "./dto/update-student-parent.dto.js";
import { QueryStudentParentDto } from "./dto/query-student-parent.dto.js";
import { StudentParentListResponseDto } from "./dto/student-parent-list-response.dto.js";
import { StudentParent } from "./entities/student_parents.entity.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@ApiTags("Student Parents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("student-parents")
export class StudentParentsController {
  constructor(private readonly studentParentsService: StudentParentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new student parent record" })
  @ApiResponse({
    status: 201,
    description: "Student parent created successfully",
    type: StudentParent,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Body() createStudentParentDto: CreateStudentParentDto) {
    return this.studentParentsService.create(createStudentParentDto);
  }

  @Get()
  @ApiOperation({
    summary: "Retrieve all student parents with pagination and filters",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (starts from 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of items per page",
    example: 10,
  })
  @ApiQuery({
    name: "parent_name",
    required: false,
    description: "Search by parent full name",
    example: "John Doe",
  })
  @ApiQuery({
    name: "parent_phone",
    required: false,
    description: "Search by parent phone number",
    example: "+998901234567",
  })
  @ApiQuery({
    name: "student_name",
    required: false,
    description: "Search by student full name",
    example: "Jane Doe",
  })
  @ApiResponse({
    status: 200,
    description: "Paginated list of student parents",
    type: StudentParentListResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  findAll(@Query() queryDto: QueryStudentParentDto) {
    return this.studentParentsService.findAll(queryDto);
  }

  @Get("student/:student_id")
  @ApiOperation({ summary: "Retrieve student parents by student ID" })
  @ApiParam({
    name: "student_id",
    description: "Student ID (UUID)",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  })
  @ApiResponse({
    status: 200,
    description: "List of student parents for the given student",
    type: [StudentParent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Student not found" })
  findByStudentId(@Param("student_id") student_id: string) {
    return this.studentParentsService.findByStudentId(student_id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve a student parent by ID" })
  @ApiParam({
    name: "id",
    description: "Student Parent ID (UUID)",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  })
  @ApiResponse({
    status: 200,
    description: "Student parent record",
    type: StudentParent,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Student parent not found" })
  findOne(@Param("id") id: string) {
    return this.studentParentsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a student parent record" })
  @ApiParam({
    name: "id",
    description: "Student Parent ID (UUID)",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  })
  @ApiResponse({
    status: 200,
    description: "Student parent updated successfully",
    type: StudentParent,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Student parent not found" })
  update(
    @Param("id") id: string,
    @Body() updateStudentParentDto: UpdateStudentParentDto,
  ) {
    return this.studentParentsService.update(id, updateStudentParentDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a student parent record" })
  @ApiParam({
    name: "id",
    description: "Student Parent ID (UUID)",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  })
  @ApiResponse({
    status: 200,
    description: "Student parent deleted successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Student parent not found" })
  remove(@Param("id") id: string) {
    return this.studentParentsService.remove(id);
  }
}
