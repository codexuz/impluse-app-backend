import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCertificateDto } from "./dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "./dto/update-certificate.dto.js";
import { Certificate } from "./entities/certificate.entity.js";
import { User } from "../users/entities/user.entity.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import { createCanvas, loadImage, registerFont } from "canvas";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class CertificatesService {
  private readonly bucketName = "speakup";
  private readonly folderPrefix = "certificates/";
  private readonly templatesDir = path.join(
    process.cwd(),
    "public",
    "templates"
  );

  constructor(
    @InjectModel(Certificate)
    private certificateModel: typeof Certificate,
    @InjectModel(User)
    private userModel: typeof User,
    private awsStorageService: AwsStorageService
  ) {
    // Register Poppins font
    try {
      const fontPath = path.join(
        process.cwd(),
        "public",
        "fonts",
        "Poppins-Bold.ttf"
      );

      if (fs.existsSync(fontPath)) {
        registerFont(fontPath, { family: "Poppins" });
        console.log(`Registered font: ${fontPath}`);
      } else {
        console.error(`Font file not found at: ${fontPath}`);
      }
    } catch (error) {
      console.error("Font registration error:", error);
    }
  }

  private generateCertificateId(): number {
    // Generate 10 digit random integer
    return Math.floor(1000000000 + Math.random() * 9000000000);
  }

  private extractLevel(courseName: string): string {
    // Extract level from course name (A1, A2, B1, B2)
    const levelMatch = courseName.match(/\b(A1|A2|B1|B2)\b/i);
    if (levelMatch) {
      return levelMatch[1].toUpperCase();
    }
    // Default to A1 if no level found
    return "A1";
  }

  private getTemplatePath(level: string): string {
    const templatePath = path.join(this.templatesDir, `${level}.png`);

    // Check if template exists, fallback to A1 if not
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }

    return path.join(this.templatesDir, "A1.png");
  }

  async generateCertificateImage(
    firstName: string,
    lastName: string,
    certificatedId: number,
    courseName: string
  ): Promise<string> {
    try {
      // Extract level and get appropriate template
      const level = this.extractLevel(courseName);
      const templatePath = this.getTemplatePath(level);

      // Load the template image
      const template = await loadImage(templatePath);

      // Create canvas with template dimensions
      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext("2d");

      // Draw template
      ctx.drawImage(template, 0, 0);

      // Configure text styling for student name
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";

      // Draw student full name at specific coordinates
      const fullName = `${firstName} ${lastName}`;
      ctx.font = "bold 17px 'Poppins'";
      ctx.fillText(fullName, 238, 216);

      // Draw certificate ID at specific coordinates
      ctx.font = "16px 'Poppins'";
      ctx.textAlign = "left";
      ctx.fillText(`${certificatedId}`, 181, 389);

      // Save the image to AWS S3
      const fileName = `${this.folderPrefix}certificate-${certificatedId}.png`;
      const buffer = canvas.toBuffer("image/png");

      await this.awsStorageService.uploadBuffer(
        this.bucketName,
        fileName,
        buffer,
        "image/png"
      );

      // Generate presigned URL (valid for 7 days)
      const url = await this.awsStorageService.getPresignedUrl(
        this.bucketName,
        fileName,
        7 * 24 * 60 * 60
      );

      return url;
    } catch (error) {
      throw new Error(`Failed to generate certificate image: ${error.message}`);
    }
  }

  async create(
    createCertificateDto: CreateCertificateDto
  ): Promise<Certificate> {
    // Find student
    const student = await this.userModel.findByPk(
      createCertificateDto.student_id
    );
    if (!student) {
      throw new NotFoundException("Student not found");
    }

    // Generate unique 10-digit certificate ID
    let certificatedId: number;
    let isUnique = false;

    while (!isUnique) {
      certificatedId = this.generateCertificateId();
      const existing = await this.certificateModel.findOne({
        where: { certificated_id: certificatedId },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Generate certificate image
    const certificateUrl = await this.generateCertificateImage(
      student.first_name,
      student.last_name,
      certificatedId,
      createCertificateDto.course_name
    );

    // Create certificate record
    const certificate = await this.certificateModel.create({
      ...createCertificateDto,
      certificated_id: certificatedId,
      certificate_url: certificateUrl,
    });

    return certificate;
  }

  async findAll(): Promise<Certificate[]> {
    return this.certificateModel.findAll({
      include: [{ model: User, as: "student" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async findByStudent(studentId: string): Promise<Certificate[]> {
    return this.certificateModel.findAll({
      where: { student_id: studentId },
      include: [{ model: User, as: "student" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificateModel.findByPk(id, {
      include: [{ model: User, as: "student" }],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return certificate;
  }

  async findByCertificateId(certificatedId: number): Promise<Certificate> {
    const certificate = await this.certificateModel.findOne({
      where: { certificated_id: certificatedId },
      include: [{ model: User, as: "student" }],
    });

    if (!certificate) {
      throw new NotFoundException(`Certificate ID ${certificatedId} not found`);
    }

    return certificate;
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto
  ): Promise<Certificate> {
    const certificate = await this.findOne(id);
    await certificate.update(updateCertificateDto);
    return certificate;
  }

  async remove(id: string): Promise<void> {
    const certificate = await this.findOne(id);

    // Delete certificate image from AWS S3 if exists
    if (certificate.certificate_url) {
      try {
        // Extract filename from URL (last part after /)
        const urlParts = certificate.certificate_url.split("/");
        const fileName = urlParts[urlParts.length - 1].split("?")[0]; // Remove query params

        await this.awsStorageService.deleteFile(this.bucketName, fileName);
      } catch (error) {
        console.error("Error deleting certificate from AWS S3:", error);
      }
    }

    await certificate.destroy();
  }
}
