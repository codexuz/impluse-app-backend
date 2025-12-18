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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { CertificatesService } from "./certificates.service";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Certificates")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("certificates")
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Generate and create a new certificate for a student",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Certificate generated and created successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Student not found",
  })
  async create(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificatesService.create(createCertificateDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all certificates" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all certificates",
  })
  async findAll() {
    return await this.certificatesService.findAll();
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all certificates for a specific student" })
  @ApiParam({ name: "studentId", description: "The student user ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return certificates for the student",
  })
  async findByStudent(@Param("studentId") studentId: string) {
    return await this.certificatesService.findByStudent(studentId);
  }

  @Get("verify/:certificatedId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Verify a certificate by certificate ID (10 digits)",
  })
  @ApiParam({
    name: "certificatedId",
    description: "The 10-digit certificate ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return certificate details",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Certificate not found",
  })
  async verifyCertificate(@Param("certificatedId") certificatedId: string) {
    return await this.certificatesService.findByCertificateId(
      parseInt(certificatedId)
    );
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a certificate by ID" })
  @ApiParam({ name: "id", description: "The certificate ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the certificate",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Certificate not found",
  })
  async findOne(@Param("id") id: string) {
    return await this.certificatesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a certificate" })
  @ApiParam({ name: "id", description: "The certificate ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Certificate updated successfully",
  })
  async update(
    @Param("id") id: string,
    @Body() updateCertificateDto: UpdateCertificateDto
  ) {
    return await this.certificatesService.update(id, updateCertificateDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a certificate" })
  @ApiParam({ name: "id", description: "The certificate ID" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Certificate deleted successfully",
  })
  async remove(@Param("id") id: string) {
    return await this.certificatesService.remove(id);
  }
}
