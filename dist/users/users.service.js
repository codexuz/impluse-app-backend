var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, ConflictException, UnauthorizedException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity.js";
import { Role } from "./entities/role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { UserSession } from "./entities/user-session.model.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
let UsersService = class UsersService {
    constructor(userModel, roleModel, studentProfileModel) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.studentProfileModel = studentProfileModel;
    }
    async checkExistingUser(username, phone) {
        const existingUser = await this.userModel.findOne({
            where: {
                [Op.or]: [{ username }, { phone }],
            },
        });
        if (existingUser) {
            throw new ConflictException("User already exists");
        }
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async createTeacher(createTeacherDto) {
        await this.checkExistingUser(createTeacherDto.username, createTeacherDto.phone);
        const hashedPassword = await this.hashPassword(createTeacherDto.password);
        const user = await this.userModel.create({
            ...createTeacherDto,
            password_hash: hashedPassword,
            is_active: true,
        });
        const teacherRole = await this.roleModel.findOne({
            where: { name: "teacher" },
        });
        if (teacherRole) {
            await user.$add("roles", teacherRole);
        }
        return this.findOne(user.user_id);
    }
    async createAdmin(createAdminDto) {
        await this.checkExistingUser(createAdminDto.username, createAdminDto.phone);
        const hashedPassword = await this.hashPassword(createAdminDto.password);
        const user = await this.userModel.create({
            ...createAdminDto,
            password_hash: hashedPassword,
            is_active: true,
        });
        const adminRole = await this.roleModel.findOne({
            where: { name: "admin" },
        });
        if (adminRole) {
            await user.$add("roles", adminRole);
        }
        return this.findOne(user.user_id);
    }
    async findAll() {
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
    async findOne(id) {
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
    async findByUsername(username) {
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
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            const saltRounds = 10;
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
        }
        await user.update(updateUserDto);
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        const transaction = await this.userModel.sequelize.transaction();
        try {
            const models = this.userModel.sequelize.models;
            if (models.UserSession) {
                await models.UserSession.destroy({
                    where: { userId: id },
                    transaction,
                });
            }
            if (models.UserRole) {
                await models.UserRole.destroy({
                    where: { userId: id },
                    transaction,
                });
            }
            if (models.StudentProfile) {
                await models.StudentProfile.destroy({
                    where: { user_id: id },
                    transaction,
                });
            }
            if (models.StudentPayment) {
                await models.StudentPayment.destroy({
                    where: {
                        [Op.or]: [{ student_id: id }, { manager_id: id }],
                    },
                    transaction,
                });
            }
            if (models.UserNotification) {
                await models.UserNotification.destroy({
                    where: { user_id: id },
                    transaction,
                });
            }
            if (models.HomeworkSubmission) {
                await models.HomeworkSubmission.destroy({
                    where: { student_id: id },
                    transaction,
                });
            }
            if (models.GroupStudent) {
                await models.GroupStudent.destroy({
                    where: { student_id: id },
                    transaction,
                });
            }
            if (models.StudentVocabularyProgress) {
                await models.StudentVocabularyProgress.destroy({
                    where: { student_id: id },
                    transaction,
                });
            }
            if (models.LessonProgress) {
                await models.LessonProgress.destroy({
                    where: { student_id: id },
                    transaction,
                });
            }
            if (models.Attendance) {
                await models.Attendance.destroy({
                    where: {
                        [Op.or]: [{ student_id: id }, { teacher_id: id }],
                    },
                    transaction,
                });
            }
            if (models.GroupHomework) {
                await models.GroupHomework.destroy({
                    where: { teacher_id: id },
                    transaction,
                });
            }
            await user.destroy({ transaction });
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        await user.update({ is_active: false });
        return user;
    }
    async activate(id) {
        const user = await this.findOne(id);
        await user.update({ is_active: true });
        return user;
    }
    async archiveStudent(studentId) {
        const user = await this.findOne(studentId);
        const hasStudentRole = user.roles?.some(role => role.name === 'student');
        if (!hasStudentRole) {
            throw new NotFoundException(`User with ID "${studentId}" is not a student`);
        }
        await user.update({ is_active: false });
        return this.findOne(studentId);
    }
    async restoreStudent(studentId) {
        const user = await this.findOne(studentId);
        const hasStudentRole = user.roles?.some(role => role.name === 'student');
        if (!hasStudentRole) {
            throw new NotFoundException(`User with ID "${studentId}" is not a student`);
        }
        await user.update({ is_active: true });
        return this.findOne(studentId);
    }
    async getAllTeachers() {
        return this.userModel.findAll({
            where: {
                is_active: true
            },
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
    async getAllAdmins() {
        return this.userModel.findAll({
            where: {
                is_active: true
            },
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
        });
    }
    async getAllStudents() {
        return this.userModel.findAll({
            where: {
                is_active: true
            },
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
    async getArchivedStudents() {
        return this.userModel.findAll({
            where: {
                is_active: false
            },
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
    async getAllSupportTeachers() {
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
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new NotFoundException(`User with ID "${userId}" not found`);
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        const hashedPassword = await this.hashPassword(newPassword);
        await user.update({ password_hash: hashedPassword });
        return this.findOne(userId);
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __param(1, InjectModel(Role)),
    __param(2, InjectModel(StudentProfile)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map