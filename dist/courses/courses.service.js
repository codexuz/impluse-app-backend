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
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { Unit } from "../units/entities/units.entity.js";
import { Course } from "./entities/course.entity.js";
import { LessonProgress } from "../lesson_progress/entities/lesson_progress.entity.js";
import { User } from "../users/entities/user.entity.js";
let CoursesService = class CoursesService {
    constructor(courseModel, userModel, lessonProgressModel) {
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.lessonProgressModel = lessonProgressModel;
    }
    async create(createCourseDto) {
        return await this.courseModel.create({
            ...createCourseDto,
        });
    }
    async findAll() {
        return await this.courseModel.findAll({
            where: {
                isActive: true,
            },
            include: [
                {
                    model: Unit,
                    as: 'units',
                    separate: true,
                    order: [['order', 'ASC']],
                },
            ],
        });
    }
    async getCourseProgress(student_id) {
        const user = await this.userModel.findByPk(student_id);
        if (!user)
            throw new NotFoundException("User not found");
        if (!user.level_id)
            throw new NotFoundException("User is not assigned to any course");
        const course = (await this.courseModel.findByPk(user.level_id, {
            include: [
                {
                    model: Unit,
                    as: "units",
                    include: ["lessons"],
                },
            ],
        }));
        if (!course)
            throw new NotFoundException("Course not found");
        const allLessons = course.units.flatMap((unit) => unit.lessons);
        const completedLessonIds = await this.lessonProgressModel.findAll({
            where: {
                student_id,
                lesson_id: allLessons.map((l) => l.id),
            },
            attributes: ["lesson_id"],
        });
        const completedCount = completedLessonIds.length;
        const total = allLessons.length;
        return {
            course_id: user.level_id,
            course_name: course.title,
            completed: completedCount,
            total,
            percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        };
    }
    async findOne(id) {
        const course = await this.courseModel.findOne({
            where: {
                id,
                isActive: true,
            },
            include: [
                {
                    model: Unit,
                    as: "units",
                    separate: true,
                    order: [['order', 'ASC']],
                },
            ],
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    async update(id, updateCourseDto) {
        const course = await this.findOne(id);
        await course.update(updateCourseDto);
        return course;
    }
    async remove(id) {
        const course = await this.findOne(id);
        await course.update({ isActive: false });
    }
    async hardRemove(id) {
        const course = await this.findOne(id);
        await course.destroy();
    }
};
CoursesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Course)),
    __param(1, InjectModel(User)),
    __param(2, InjectModel(LessonProgress)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CoursesService);
export { CoursesService };
//# sourceMappingURL=courses.service.js.map