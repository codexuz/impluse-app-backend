import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { Op } from "sequelize";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { Role } from "./entities/role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { UserSession } from "./entities/user-session.model.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import { Course } from "../courses/entities/course.entity.js";

@Injectable()
export class UsersService {
  private readonly storageBucket = process.env.AWS_BUCKET || "speakup";

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile,
    private configService: ConfigService,
    private awsStorageService: AwsStorageService,
  ) {}

  private async checkExistingUser(
    username: string,
    phone: string,
  ): Promise<void> {
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username }, { phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<User> {
    // Check if user already exists
    await this.checkExistingUser(
      createTeacherDto.username,
      createTeacherDto.phone,
    );

    // Hash password
    const hashedPassword = await this.hashPassword(createTeacherDto.password);

    // Create user
    const user = await this.userModel.create({
      ...createTeacherDto,
      password_hash: hashedPassword,
      is_active: true,
    });

    // Assign teacher role
    const teacherRole = await this.roleModel.findOne({
      where: { name: "teacher" },
    });
    if (teacherRole) {
      await user.$add("roles", teacherRole);
    }

    // Return user with profile included
    return this.findOne(user.user_id);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    // Check if user already exists
    await this.checkExistingUser(createAdminDto.username, createAdminDto.phone);

    // Hash password
    const hashedPassword = await this.hashPassword(createAdminDto.password);

    // Create user
    const user = await this.userModel.create({
      ...createAdminDto,
      password_hash: hashedPassword,
      is_active: true,
    });

    // Assign admin role
    const adminRole = await this.roleModel.findOne({
      where: { name: "admin" },
    });
    if (adminRole) {
      await user.$add("roles", adminRole);
    }

    // Return user with profile included
    return this.findOne(user.user_id);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: StudentProfile,
          as: "student_profile",
        },
        {
          model: UserSession,
          as: "sessions",
          attributes: ["id", "isActive", "createdAt", "updatedAt"],
        },
        {
          model: StudentPayment,
          as: "payments",
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { username },
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
        },
        {
          model: StudentProfile,
          as: "student_profile",
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // If updating password, hash it
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    await user.update(updateUserDto);
    return this.findOne(id);
  }

  /**
   * Remove a user and all associated data across the system
   * @param id The user ID to delete
   */
  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // Start transaction to ensure all deletions succeed or fail together
    const transaction = await this.userModel.sequelize.transaction();

    try {
      // Get database models from Sequelize
      const models = this.userModel.sequelize.models;

      // Delete user sessions
      if (models.UserSession) {
        await models.UserSession.destroy({
          where: { userId: id },
          transaction,
        });
      }

      // Delete user roles associations
      if (models.UserRole) {
        await models.UserRole.destroy({
          where: { userId: id },
          transaction,
        });
      }

      // Delete student profile if exists
      if (models.StudentProfile) {
        await models.StudentProfile.destroy({
          where: { user_id: id },
          transaction,
        });
      }

      // Delete student payments
      // if (models.StudentPayment) {
      //   await models.StudentPayment.destroy({
      //     where: {
      //       [Op.or]: [{ student_id: id }, { manager_id: id }],
      //     },
      //     transaction,
      //   });
      // }

      // Delete user notifications
      if (models.UserNotification) {
        await models.UserNotification.destroy({
          where: { user_id: id },
          transaction,
        });
      }

      // Delete homework submissions if user is a student
      if (models.HomeworkSubmission) {
        await models.HomeworkSubmission.destroy({
          where: { student_id: id },
          transaction,
        });
      }

      // Delete group students associations
      if (models.GroupStudent) {
        await models.GroupStudent.destroy({
          where: { student_id: id },
          transaction,
        });
      }

      // Delete student vocabulary progress
      if (models.StudentVocabularyProgress) {
        await models.StudentVocabularyProgress.destroy({
          where: { student_id: id },
          transaction,
        });
      }

      // Delete lesson progress
      if (models.LessonProgress) {
        await models.LessonProgress.destroy({
          where: { student_id: id },
          transaction,
        });
      }

      // Delete attendance records
      if (models.Attendance) {
        await models.Attendance.destroy({
          where: {
            [Op.or]: [{ student_id: id }, { teacher_id: id }],
          },
          transaction,
        });
      }

      // Delete group homeworks created by teacher
      if (models.GroupHomework) {
        await models.GroupHomework.destroy({
          where: { teacher_id: id },
          transaction,
        });
      }

      // Finally, delete the user
      await user.destroy({ transaction });

      // Commit the transaction if everything succeeded
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction if anything failed
      await transaction.rollback();
      throw error;
    }
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);

    // Check if user is a student
    const hasStudentRole = user.roles?.some((role) => role.name === "student");

    if (hasStudentRole) {
      // Set student status to 'removed' in all groups
      const models = this.userModel.sequelize.models;
      if (models.GroupStudent) {
        await models.GroupStudent.update(
          { status: "removed" },
          { where: { student_id: id } },
        );
      }
    }

    await user.update({ is_active: false });
    return user;
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    await user.update({ is_active: true });
    return user;
  }

  /**
   * Archive a student by setting is_active to false
   * @param studentId The student's user ID
   * @returns The updated user object
   */
  async archiveStudent(studentId: string): Promise<User> {
    const user = await this.findOne(studentId);

    // Verify user has student role
    const hasStudentRole = user.roles?.some((role) => role.name === "student");
    if (!hasStudentRole) {
      throw new NotFoundException(
        `User with ID "${studentId}" is not a student`,
      );
    }

    await user.update({ is_active: false });
    return this.findOne(studentId);
  }

  /**
   * Restore an archived student by setting is_active to true
   * @param studentId The student's user ID
   * @returns The updated user object
   */
  async restoreStudent(studentId: string): Promise<User> {
    const user = await this.findOne(studentId);

    // Verify user has student role
    const hasStudentRole = user.roles?.some((role) => role.name === "student");
    if (!hasStudentRole) {
      throw new NotFoundException(
        `User with ID "${studentId}" is not a student`,
      );
    }

    await user.update({ is_active: true });
    return this.findOne(studentId);
  }

  async getAllTeachers(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      is_active: true,
    };

    // Add search query if provided
    if (query) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
        { username: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "teacher" },
          through: { attributes: [] },
        },
        {
          model: TeacherProfile,
          as: "teacher_profile",
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getAllAdmins(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      is_active: true,
    };

    // Add search query if provided
    if (query) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
        { username: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "admin" },
          through: { attributes: [] },
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getAllStudents(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      is_active: true,
    };

    // Add search query if provided
    if (query) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
        { username: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "student" },
          through: { attributes: [] },
        },
        {
          model: StudentProfile,
          as: "student_profile",
        },
        {
          model: Course,
          as: "level",
          required: false,
        },
        {
          model: this.userModel.sequelize.models.StudentParent,
          as: "student_parents",
          required: false,
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getArchivedStudents(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      is_active: false,
    };

    // Add search query if provided
    if (query) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
        { username: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "student" },
          through: { attributes: [] },
        },
        {
          model: StudentProfile,
          as: "student_profile",
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getAllSupportTeachers(
    page: number = 1,
    limit: number = 10,
    query?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    // Add search query if provided
    if (query) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${query}%` } },
        { last_name: { [Op.like]: `%${query}%` } },
        { username: { [Op.like]: `%${query}%` } },
        { phone: { [Op.like]: `%${query}%` } },
      ];
    }

    const { count, rows } = await this.userModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: ["password_hash"],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "support_teacher" },
          through: { attributes: [] },
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Update a user's password after verifying the current password
   * @param userId The user's ID
   * @param currentPassword The current password for verification
   * @param newPassword The new password to set
   * @returns The updated user object
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    // Find the user with password_hash included for verification
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Hash the new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update the password
    await user.update({ password_hash: hashedPassword });

    // Return user without password_hash
    return this.findOne(userId);
  }

  /**
   * Upload avatar to MinIO and update user
   * @param userId The user's ID
   * @param file The uploaded file
   * @returns The updated user object with the new avatar URL
   */
  async uploadAvatarToMinio(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    const filename = `avatar-${uniqueSuffix}.${ext}`;
    const objectName = `avatars/${filename}`;

    // Upload to AWS S3
    await this.awsStorageService.uploadBuffer(
      this.storageBucket,
      objectName,
      file.buffer,
      file.mimetype,
    );

    // Generate presigned URL from AWS S3 (valid for 7 days)
    // const avatarUrl = await this.awsStorageService.getPresignedUrl(
    //   this.storageBucket,
    //   objectName,
    //   7 * 24 * 60 * 60,
    // );

    const avatarUrl = `https://18406281-4440-4933-b3cd-7a96648fd82c.srvstatic.uz/${objectName}`;

    // Update the user's avatar_url
    await user.update({ avatar_url: avatarUrl });

    // Return updated user without password_hash
    return this.findOne(userId);
  }

  /**
   * Update user avatar after uploading a file to AWS S3
   * @param userId The user's ID
   * @param filename The uploaded file name in AWS S3
   * @returns The updated user object with the new avatar URL
   */
  async updateAvatar(userId: string, filename: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Generate presigned URL from AWS S3 (valid for 7 days)
    // const avatarUrl = await this.awsStorageService.getPresignedUrl(
    //   this.storageBucket,
    //   `avatars/${filename}`,
    //   7 * 24 * 60 * 60,
    // );

    const avatarUrl = `https://18406281-4440-4933-b3cd-7a96648fd82c.srvstatic.uz/avatars/${filename}`;

    // Update the user's avatar_url
    await user.update({ avatar_url: avatarUrl });

    // Return updated user without password_hash
    return this.findOne(userId);
  }

  /**
   * Update user avatar URL directly
   * @param userId The user's ID
   * @param avatarUrl The avatar URL to set
   * @returns The updated user object
   */
  async updateAvatarUrl(userId: string, avatarUrl: string): Promise<User> {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Update the user's avatar_url
    await user.update({ avatar_url: avatarUrl });

    // Return updated user without password_hash
    return this.findOne(userId);
  }
}
