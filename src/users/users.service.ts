import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { Op, Sequelize } from "sequelize";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity.js";
import { ArchivedStudent } from "./entities/archived-student.entity.js";
import { CreateArchivedStudentDto } from "./dto/create-archived-student.dto.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CreateRoleDto } from "./dto/create-role.dto.js";
import { UpdateRoleDto } from "./dto/update-role.dto.js";
import { AssignRoleDto } from "./dto/assign-role.dto.js";
import { Role } from "./entities/role.model.js";
import { UserRole } from "./entities/user-role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { UserSession } from "./entities/user-session.model.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { AwsStorageService } from "../aws-storage/aws-storage.service.js";
import { Course } from "../courses/entities/course.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";

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
    @InjectModel(ArchivedStudent)
    private archivedStudentModel: typeof ArchivedStudent,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(UserRole)
    private userRoleModel: typeof UserRole,
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

  async getUsersByRole(
    roleName: string,
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
    const role = await this.roleModel.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role "${roleName}" not found`);
    }

    const offset = (page - 1) * limit;
    const whereClause: any = {};

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
          where: { name: roleName },
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

  async findAll(
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
   * Soft-remove a user by setting is_active to false
   * @param id The user ID to deactivate
   */
  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await user.update({ is_active: false });
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

    // Set student status back to 'active' in all groups
    const models = this.userModel.sequelize.models;
    if (models.GroupStudent) {
      await models.GroupStudent.update(
        { status: "active" },
        { where: { student_id: id, status: "removed" } },
      );
    }

    // Remove from archived students
    await this.archivedStudentModel.destroy({
      where: { user_id: id },
    });

    return user;
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

  async getStudentStats(): Promise<{
    activeStudentsCount: number;
    newStudentsThisMonth: number;
  }> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const studentRole = await this.roleModel.findOne({
      where: { name: "student" },
    });

    if (!studentRole) {
      return { activeStudentsCount: 0, newStudentsThisMonth: 0 };
    }

    const activeStudentsCount = await this.userModel.count({
      where: {
        is_active: true,
        // Exclude users who have multiple roles (e.g. student+teacher, student+guest)
        [Op.and]: [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM user_roles WHERE user_roles.userId = \`User\`.user_id) = 1`,
          ),
        ],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "student" },
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    const newStudentsThisMonth = await this.userModel.count({
      where: {
        is_active: true,
        created_at: { [Op.gte]: startOfMonth },
        // Exclude users who have multiple roles (e.g. student+teacher, student+guest)
        [Op.and]: [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM user_roles WHERE user_roles.userId = \`User\`.user_id) = 1`,
          ),
        ],
      },
      include: [
        {
          model: Role,
          as: "roles",
          where: { name: "student" },
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    return { activeStudentsCount, newStudentsThisMonth };
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
      // Exclude users who have multiple roles (e.g. student+teacher, student+guest)
      [Op.and]: [
        Sequelize.literal(
          `(SELECT COUNT(*) FROM user_roles WHERE user_roles.userId = \`User\`.user_id) = 1`,
        ),
      ],
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
          required: true,
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

  async getAllGuestStudents(
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
          where: { name: "guest" },
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

  // ==================== Archived Students ====================

  async createArchivedStudent(
    dto: CreateArchivedStudentDto,
  ): Promise<ArchivedStudent> {
    // Find the student's active group to get teacher_id and group_id
    const groupStudent = await this.groupStudentModel.findOne({
      where: { student_id: dto.user_id, status: "active" },
      include: [{ model: Group, attributes: ["id", "teacher_id"] }],
      order: [["createdAt", "DESC"]],
    });

    const archivedStudent = await this.archivedStudentModel.create({
      user_id: dto.user_id,
      reason: dto.reason,
      notes: dto.notes,
      group_id: groupStudent?.group_id || null,
      teacher_id: groupStudent?.group?.teacher_id || null,
    } as any);

    // Deactivate the student
    await this.deactivate(dto.user_id);

    return archivedStudent;
  }

  async findAllArchivedStudents(
    page: number = 1,
    limit: number = 10,
    reason?: string,
  ): Promise<{
    data: ArchivedStudent[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (reason) {
      where.reason = reason;
    }

    const { rows: data, count: total } =
      await this.archivedStudentModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            as: "student",
            attributes: [
              "user_id",
              "first_name",
              "last_name",
              "phone",
              "avatar_url",
            ],
          },
          {
            model: User,
            as: "teacher",
            attributes: ["user_id", "first_name", "last_name"],
          },
          { model: Group, attributes: ["id", "name"] },
        ],
      });

    return { data, total, page, limit };
  }

  async findOneArchivedStudent(id: string): Promise<ArchivedStudent> {
    const record = await this.archivedStudentModel.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "first_name",
            "last_name",
            "phone",
            "avatar_url",
          ],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name"],
        },
        { model: Group, attributes: ["id", "name"] },
      ],
    });

    if (!record) {
      throw new NotFoundException(`Archived student with ID "${id}" not found`);
    }

    return record;
  }

  async deleteArchivedStudent(id: string): Promise<void> {
    const record = await this.archivedStudentModel.findByPk(id);
    if (!record) {
      throw new NotFoundException(`Archived student with ID "${id}" not found`);
    }
    await record.destroy();
  }

  async getArchivedStudentStatistics(
    startDate?: string,
    endDate?: string,
    teacher_id?: string,
    group_id?: string,
  ) {
    const where: any = {};

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }
    if (teacher_id) where.teacher_id = teacher_id;
    if (group_id) where.group_id = group_id;

    // Total archived count
    const totalArchived = await this.archivedStudentModel.count({ where });

    // Breakdown by reason
    const byReason = await this.archivedStudentModel.findAll({
      where,
      attributes: [
        "reason",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["reason"],
      raw: true,
    });

    // Monthly trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const trendWhere: any = {
      ...where,
      created_at: { [Op.gte]: twelveMonthsAgo },
    };
    if (where.created_at) {
      trendWhere.created_at = { ...where.created_at, [Op.gte]: twelveMonthsAgo };
    }

    const monthlyTrend = await this.archivedStudentModel.findAll({
      where: trendWhere,
      attributes: [
        [Sequelize.fn("DATE_FORMAT", Sequelize.col("created_at"), "%Y-%m"), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("created_at"), "%Y-%m")],
      order: [[Sequelize.fn("DATE_FORMAT", Sequelize.col("created_at"), "%Y-%m"), "ASC"]],
      raw: true,
    });

    // Top teachers with most archived students
    const byTeacher = await this.archivedStudentModel.findAll({
      where: { ...where, teacher_id: { [Op.ne]: null } },
      attributes: [
        "teacher_id",
        [Sequelize.fn("COUNT", Sequelize.col("ArchivedStudent.id")), "count"],
      ],
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name"],
        },
      ],
      group: ["teacher_id", "teacher.user_id"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("ArchivedStudent.id")), "DESC"]],
      limit: 10,
      subQuery: false,
    });

    // By group
    const byGroup = await this.archivedStudentModel.findAll({
      where: { ...where, group_id: { [Op.ne]: null } },
      attributes: [
        "group_id",
        [Sequelize.fn("COUNT", Sequelize.col("ArchivedStudent.id")), "count"],
      ],
      include: [
        {
          model: Group,
          attributes: ["id", "name"],
        },
      ],
      group: ["group_id", "group.id"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("ArchivedStudent.id")), "DESC"]],
      limit: 10,
      subQuery: false,
    });

    // Current period stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const thisMonthCount = await this.archivedStudentModel.count({
      where: { ...where, created_at: { [Op.gte]: startOfMonth } },
    });

    const lastMonthCount = await this.archivedStudentModel.count({
      where: {
        ...where,
        created_at: { [Op.gte]: startOfLastMonth, [Op.lte]: endOfLastMonth },
      },
    });

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekCount = await this.archivedStudentModel.count({
      where: { ...where, created_at: { [Op.gte]: startOfWeek } },
    });

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await this.archivedStudentModel.count({
      where: { ...where, created_at: { [Op.gte]: todayStart } },
    });

    // Month-over-month change percentage
    const monthOverMonthChange =
      lastMonthCount > 0
        ? Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : thisMonthCount > 0
          ? 100
          : 0;

    return {
      totalArchived,
      periodStats: {
        today: todayCount,
        thisWeek: thisWeekCount,
        thisMonth: thisMonthCount,
        lastMonth: lastMonthCount,
        monthOverMonthChange,
      },
      byReason,
      monthlyTrend,
      byTeacher,
      byGroup,
    };
  }

  /**
   * Permanently delete a user and ALL associated records from the database.
   * This action is irreversible.
   * @param id The user ID to permanently delete
   */
  async hardDeleteUser(
    id: string,
  ): Promise<{ message: string; deletedAssociations: Record<string, number> }> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const sequelize = this.userModel.sequelize;
    const transaction = await sequelize.transaction();
    const deletedAssociations: Record<string, number> = {};

    try {
      const models = sequelize.models;

      // Delete from junction / child tables that reference user_id or related FK columns
      // Each entry: [ModelName, foreignKeyColumn]
      const associatedTables: [string, string][] = [
        // User identity & auth
        ["UserRole", "userId"],
        ["UserSession", "userId"],
        ["SmsVerification", "userId"],

        // Student-related
        ["StudentProfile", "user_id"],
        ["StudentParent", "student_id"],
        ["StudentWallet", "student_id"],
        ["StudentTransaction", "student_id"],
        ["StudentVocabularyProgress", "student_id"],
        ["StudentPayment", "student_id"],

        // Teacher-related
        ["TeacherProfile", "user_id"],
        ["TeacherWallet", "teacher_id"],
        ["TeacherTransaction", "teacher_id"],

        // Groups
        ["GroupStudent", "student_id"],
        ["GroupAssignedLesson", "granted_by"],
        ["GroupAssignedUnit", "teacher_id"],
        ["GroupHomework", "teacher_id"],

        // Homework & Attendance
        ["HomeworkSubmission", "student_id"],
        ["Attendance", "student_id"],
        ["AttendanceLog", "student_id"],

        // Lesson progress
        ["LessonProgress", "student_id"],
        ["UserCourse", "userId"],

        // Payments & Actions
        ["PaymentAction", "manager_id"],

        // Exams
        ["ExamResult", "student_id"],

        // Compensate lessons
        ["CompensateLesson", "teacher_id"],
        ["CompensateLesson", "student_id"],
        ["CompensateTeacherWallet", "teacher_id"],

        // Support
        ["SupportSchedule", "support_teacher_id"],
        ["SupportBooking", "student_id"],
        ["SupportBooking", "support_teacher_id"],

        // Chat
        ["GroupChatMembers", "user_id"],
        ["Messages", "sender_id"],

        // Notifications
        ["UserNotification", "user_id"],
        ["NotificationToken", "user_id"],

        // AI Chat
        ["chatHistory", "userId"],

        // Archived students (as student and as teacher)
        ["ArchivedStudent", "user_id"],
        ["ArchivedStudent", "teacher_id"],

        // Lead trial lessons
        ["LeadTrialLesson", "teacher_id"],

        // IELTS
        ["IeltsMockTest", "user_id"],
        ["IeltsAnswerAttempt", "user_id"],
        ["IeltsWritingAnswer", "user_id"],
        ["IeltsReadingAnswer", "user_id"],
        ["IeltsListeningAnswer", "user_id"],
        ["IeltsLessonProgress", "user_id"],
        ["IeltsQuizAttempt", "user_id"],

        // Expenses
        ["Expense", "reported_by"],
        ["Expense", "teacher_id"],

        // Speaking
        ["SpeakingResponse", "student_id"],

        // CD IELTS
        ["CdRegister", "student_id"],

        // Audio
        ["Audio", "studentId"],
        ["AudioComment", "userId"],
        ["AudioLike", "userId"],
        ["AudioJudge", "judgeUserId"],

        // Certificates
        ["Certificate", "student_id"],
      ];

      for (const [modelName, fkColumn] of associatedTables) {
        if (models[modelName]) {
          const deleted = await models[modelName].destroy({
            where: { [fkColumn]: id },
            force: true, // bypass paranoid soft-delete so FK rows are truly removed
            transaction,
          });
          if (deleted > 0) {
            const key = `${modelName}.${fkColumn}`;
            deletedAssociations[key] =
              (deletedAssociations[key] || 0) + deleted;
          }
        }
      }

      // Nullify teacher_id on groups so the group is not deleted, just unassigned
      if (models.Group) {
        const [updatedCount] = await models.Group.update(
          { teacher_id: null },
          { where: { teacher_id: id }, transaction },
        );
        if (updatedCount > 0) {
          deletedAssociations["Group.teacher_id (nullified)"] = updatedCount;
        }
      }

      // Finally, delete the user record itself
      await user.destroy({ transaction });

      await transaction.commit();

      return {
        message: `User "${user.first_name} ${user.last_name}" and all associated data have been permanently deleted.`,
        deletedAssociations,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==================== Roles CRUD ====================

  async findAllRoles(): Promise<Role[]> {
    return this.roleModel.findAll({
      order: [["id", "ASC"]],
    });
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.roleModel.findByPk(id);
    if (!role) {
      throw new NotFoundException(`Role with ID "${id}" not found`);
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleModel.findOne({
      where: { name: createRoleDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Role with name "${createRoleDto.name}" already exists`,
      );
    }
    return this.roleModel.create({
      ...createRoleDto,
    });
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOneRole(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.roleModel.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Role with name "${updateRoleDto.name}" already exists`,
        );
      }
    }

    await role.update(updateRoleDto);
    return role;
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findOneRole(id);

    // Prevent deletion of protected system roles
    const protectedRoles = [
      "admin",
      "teacher",
      "student",
      "support_teacher",
      "guest",
    ];
    if (protectedRoles.includes(role.name)) {
      throw new BadRequestException(
        `Cannot delete protected system role "${role.name}"`,
      );
    }

    // Check if any users are assigned to this role
    const assignedCount = await this.userRoleModel.count({
      where: { roleId: id },
    });
    if (assignedCount > 0) {
      throw new BadRequestException(
        `Cannot delete role "${role.name}" — it is assigned to ${assignedCount} user(s). Remove assignments first.`,
      );
    }

    await role.destroy();
  }

  // ==================== User Roles Management ====================

  async getUserRoles(userId: string): Promise<Role[]> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: ["assignedAt", "expiresAt"] },
        },
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user.roles || [];
  }

  async assignRoleToUser(
    userId: string,
    assignRoleDto: AssignRoleDto,
  ): Promise<{ message: string }> {
    // Verify user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify role exists
    const role = await this.roleModel.findByPk(assignRoleDto.roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with ID "${assignRoleDto.roleId}" not found`,
      );
    }

    // Check if already assigned
    const existing = await this.userRoleModel.findOne({
      where: { userId, roleId: assignRoleDto.roleId },
    });
    if (existing) {
      throw new ConflictException(`User already has role "${role.name}"`);
    }

    await this.userRoleModel.create({
      userId,
      roleId: assignRoleDto.roleId,
      assignedAt: new Date(),
      expiresAt: assignRoleDto.expiresAt
        ? new Date(assignRoleDto.expiresAt)
        : null,
    });

    return { message: `Role "${role.name}" assigned to user successfully` };
  }

  async removeRoleFromUser(
    userId: string,
    roleId: number,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const role = await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    const deleted = await this.userRoleModel.destroy({
      where: { userId, roleId },
    });

    if (deleted === 0) {
      throw new NotFoundException(`User does not have role "${role.name}"`);
    }

    return { message: `Role "${role.name}" removed from user successfully` };
  }
}
