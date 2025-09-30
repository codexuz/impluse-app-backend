import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { Role } from "./entities/role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { UserSession } from "./entities/user-session.model.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile
  ) {}

  private async checkExistingUser(
    username: string,
    phone: string
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
      createTeacherDto.phone
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
        saltRounds
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
      if (models.StudentPayment) {
        await models.StudentPayment.destroy({
          where: {
            [Op.or]: [{ student_id: id }, { manager_id: id }],
          },
          transaction,
        });
      }

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
    await user.update({ is_active: false });
    return user;
  }

  async activate(id: string): Promise<User> {
    const user = await this.findOne(id);
    await user.update({ is_active: true });
    return user;
  }

  async getAllTeachers(): Promise<User[]> {
    return this.userModel.findAll({
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
      ],
    });
  }

  async getAllStudents(): Promise<User[]> {
    return this.userModel.findAll({
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
    });
  }

  async getAllSupportTeachers(): Promise<User[]> {
    return this.userModel.findAll({
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
    });
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
    newPassword: string
  ): Promise<User> {
    // Find the user with password_hash included for verification
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
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
}
