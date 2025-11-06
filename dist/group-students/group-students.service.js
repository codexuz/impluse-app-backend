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
import { Injectable, NotFoundException, ConflictException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GroupStudent } from "./entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";
let GroupStudentsService = class GroupStudentsService {
    constructor(groupStudentModel, groupModel) {
        this.groupStudentModel = groupStudentModel;
        this.groupModel = groupModel;
    }
    async create(createDto) {
        const existingInSameGroup = await this.groupStudentModel.findOne({
            where: {
                group_id: createDto.group_id,
                student_id: createDto.student_id,
                status: ["active", "frozen"],
            },
        });
        if (existingInSameGroup) {
            throw new ConflictException(`Student is already enrolled in this group with status: ${existingInSameGroup.status}`);
        }
        return await this.groupStudentModel.create({
            ...createDto,
        });
    }
    async findAll() {
        return await this.groupStudentModel.findAll({
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async findOne(id) {
        const groupStudent = await this.groupStudentModel.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
        if (!groupStudent) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }
        return groupStudent;
    }
    async findByGroupId(groupId) {
        return await this.groupStudentModel.findAll({
            where: { group_id: groupId },
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async findByStudentId(studentId) {
        return await this.groupStudentModel.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async findActiveByGroupId(groupId) {
        return await this.groupStudentModel.findAll({
            where: {
                group_id: groupId,
                status: "active",
            },
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async update(id, updateDto) {
        const [affectedCount] = await this.groupStudentModel.update(updateDto, {
            where: { id },
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.groupStudentModel.destroy({
            where: { id },
        });
        if (result === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }
        return { id, deleted: true };
    }
    async updateStatus(id, status) {
        const [affectedCount] = await this.groupStudentModel.update({ status }, { where: { id } });
        if (affectedCount === 0) {
            throw new NotFoundException(`Group student with ID ${id} not found`);
        }
        return await this.findOne(id);
    }
    async transferStudent(studentId, fromGroupId, toGroupId) {
        const existingEnrollment = await this.groupStudentModel.findOne({
            where: {
                student_id: studentId,
                group_id: fromGroupId,
                status: "active",
            },
        });
        if (!existingEnrollment) {
            throw new NotFoundException(`Student is not actively enrolled in the source group (ID: ${fromGroupId})`);
        }
        const existingInTargetGroup = await this.groupStudentModel.findOne({
            where: {
                group_id: toGroupId,
                student_id: studentId,
                status: ["active", "frozen"],
            },
        });
        if (existingInTargetGroup) {
            throw new ConflictException(`Student is already enrolled in the target group with status: ${existingInTargetGroup.status}`);
        }
        await existingEnrollment.destroy();
        const newEnrollment = await this.groupStudentModel.create({
            group_id: toGroupId,
            student_id: studentId,
            enrolled_at: new Date(),
            status: "active",
        });
        return {
            removed: existingEnrollment,
            added: await this.findOne(newEnrollment.id),
        };
    }
    async countStudentsByTeacher(teacherId) {
        const teacherGroups = await this.groupModel.findAll({
            where: { teacher_id: teacherId },
            attributes: ["id"],
        });
        if (teacherGroups.length === 0) {
            return 0;
        }
        const groupIds = teacherGroups.map((group) => group.id);
        const studentCount = await this.groupStudentModel.count({
            where: {
                group_id: groupIds,
                status: "active",
            },
            distinct: true,
            col: "student_id",
        });
        return studentCount;
    }
    async getStudentsByTeacher(teacherId) {
        const teacherGroups = await this.groupModel.findAll({
            where: { teacher_id: teacherId },
            attributes: ["id"],
        });
        if (teacherGroups.length === 0) {
            return [];
        }
        const groupIds = teacherGroups.map((group) => group.id);
        return await this.groupStudentModel.findAll({
            where: {
                group_id: groupIds,
                status: "active",
            },
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: [
                        "user_id",
                        "username",
                        "first_name",
                        "last_name",
                        "avatar_url",
                        "phone",
                    ],
                },
                {
                    model: Group,
                    as: "group",
                    attributes: ["id", "name", "level_id"],
                    include: [
                        {
                            model: User,
                            as: "teacher",
                            attributes: [
                                "user_id",
                                "username",
                                "first_name",
                                "last_name",
                                "avatar_url",
                            ],
                        },
                    ],
                },
            ],
        });
    }
};
GroupStudentsService = __decorate([
    Injectable(),
    __param(0, InjectModel(GroupStudent)),
    __param(1, InjectModel(Group)),
    __metadata("design:paramtypes", [Object, Object])
], GroupStudentsService);
export { GroupStudentsService };
//# sourceMappingURL=group-students.service.js.map