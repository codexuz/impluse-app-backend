import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CdIeltsService } from "./cd-ielts.service.js";
import { CreateCdIeltDto } from "./dto/create-cd-ielt.dto.js";
import { UpdateCdIeltDto } from "./dto/update-cd-ielt.dto.js";
import { CreateCdRegisterDto } from "./dto/create-cd-register.dto.js";
import { UpdateCdRegisterDto } from "./dto/update-cd-register.dto.js";
import { PaginationDto } from "./dto/pagination.dto.js";
import { FilterTestsDto } from "./dto/filter-tests.dto.js";
import { FilterRegistrationsDto } from "./dto/filter-registrations.dto.js";

@ApiTags("CD IELTS")
@ApiBearerAuth()
@Controller("cd-ielts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CdIeltsController {
  constructor(private readonly cdIeltsService: CdIeltsService) {}

  // CD IELTS Test Endpoints
  @Post("tests")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new IELTS test" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The test has been successfully created",
  })
  createTest(@Body() createCdIeltDto: CreateCdIeltDto) {
    return this.cdIeltsService.createTest(createCdIeltDto);
  }

  @Get("tests")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all IELTS tests" })
  @ApiResponse({ status: HttpStatus.OK, description: "Return all IELTS tests" })
  findAllTests(
    @Query() filters?: FilterTestsDto,
    @Query() pagination?: PaginationDto,
  ) {
    return this.cdIeltsService.findAllTests(filters, pagination);
  }

  @Get("tests/active")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all active IELTS tests" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all active IELTS tests",
  })
  findActiveTests(@Query() pagination?: PaginationDto) {
    return this.cdIeltsService.findActiveTests(pagination);
  }

  @Get("tests/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an IELTS test by ID" })
  @ApiResponse({ status: HttpStatus.OK, description: "Return the IELTS test" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Test not found" })
  findOneTest(@Param("id") id: string) {
    return this.cdIeltsService.findOneTest(id);
  }

  @Patch("tests/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update an IELTS test" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The test has been successfully updated",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Test not found" })
  updateTest(
    @Param("id") id: string,
    @Body() updateCdIeltDto: UpdateCdIeltDto,
  ) {
    return this.cdIeltsService.updateTest(id, updateCdIeltDto);
  }

  @Delete("tests/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete an IELTS test" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The test has been successfully deleted",
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Test not found" })
  removeTest(@Param("id") id: string) {
    return this.cdIeltsService.removeTest(id);
  }

  // CD IELTS Registration Endpoints
  @Post("registrations")
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: "Register for an IELTS test" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The registration has been successfully created",
  })
  register(@Body() createCdRegisterDto: CreateCdRegisterDto) {
    return this.cdIeltsService.registerForTest(createCdRegisterDto);
  }

  @Get("registrations")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all IELTS registrations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all IELTS registrations",
  })
  findAllRegistrations(
    @Query() filters?: FilterRegistrationsDto,
    @Query() pagination?: PaginationDto,
  ) {
    return this.cdIeltsService.findAllRegistrations(filters, pagination);
  }

  @Get("registrations/test/:testId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all registrations for a specific test" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all registrations for this test",
  })
  findRegistrationsByTest(
    @Param("testId") testId: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.cdIeltsService.findRegistrationsByTest(testId, pagination);
  }

  @Get("registrations/student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all registrations for a specific student" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all registrations for this student",
  })
  findRegistrationsByStudent(
    @Param("studentId") studentId: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.cdIeltsService.findRegistrationsByStudent(
      studentId,
      pagination,
    );
  }

  @Get("registrations/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a registration by ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the registration",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Registration not found",
  })
  findOneRegistration(@Param("id") id: string) {
    return this.cdIeltsService.findOneRegistration(id);
  }

  @Patch("registrations/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a registration" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The registration has been successfully updated",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Registration not found",
  })
  updateRegistration(
    @Param("id") id: string,
    @Body() updateCdRegisterDto: UpdateCdRegisterDto,
  ) {
    return this.cdIeltsService.updateRegistration(id, updateCdRegisterDto);
  }

  @Delete("registrations/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: "Delete a registration" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The registration has been successfully deleted",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Registration not found",
  })
  removeRegistration(@Param("id") id: string) {
    return this.cdIeltsService.removeRegistration(id);
  }
}
