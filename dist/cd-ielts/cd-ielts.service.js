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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CdIelts } from './entities/cd-ielt.entity.js';
import { CdRegister } from './entities/cd-register.entity.js';
import { User } from '../users/entities/user.entity.js';
let CdIeltsService = class CdIeltsService {
    constructor(cdIeltsModel, cdRegisterModel, userModel) {
        this.cdIeltsModel = cdIeltsModel;
        this.cdRegisterModel = cdRegisterModel;
        this.userModel = userModel;
    }
    async createTest(createCdIeltDto) {
        return this.cdIeltsModel.create({ ...createCdIeltDto });
    }
    async findAllTests() {
        const tests = await this.cdIeltsModel.findAll();
        return tests.map(test => {
            const rawTest = test.toJSON();
            return {
                ...rawTest,
                available_seats: test.seats > 0 ? test.seats : 'Fully booked'
            };
        });
    }
    async findActiveTests() {
        const tests = await this.cdIeltsModel.findAll({
            where: {
                status: 'active',
                exam_date: {
                    [Op.gte]: new Date()
                }
            },
            order: [['exam_date', 'ASC']]
        });
        return tests.map(test => {
            const rawTest = test.toJSON();
            return {
                ...rawTest,
                available_seats: test.seats > 0 ? test.seats : 'Fully booked'
            };
        });
    }
    async findOneTest(id) {
        const test = await this.cdIeltsModel.findByPk(id);
        if (!test) {
            throw new NotFoundException(`IELTS test with ID "${id}" not found`);
        }
        const rawTest = test.toJSON();
        return {
            ...rawTest,
            available_seats: test.seats > 0 ? test.seats : 'Fully booked'
        };
    }
    async updateTest(id, updateCdIeltDto) {
        const test = await this.cdIeltsModel.findByPk(id);
        if (!test) {
            throw new NotFoundException(`IELTS test with ID "${id}" not found`);
        }
        await test.update(updateCdIeltDto);
        const rawTest = test.toJSON();
        return {
            ...rawTest,
            available_seats: test.seats > 0 ? test.seats : 'Fully booked'
        };
    }
    async removeTest(id) {
        const test = await this.findOneTest(id);
        await test.destroy();
    }
    async registerForTest(createCdRegisterDto) {
        const testModel = await this.cdIeltsModel.findByPk(createCdRegisterDto.cd_test_id);
        if (!testModel) {
            throw new NotFoundException(`IELTS test with ID "${createCdRegisterDto.cd_test_id}" not found`);
        }
        if (testModel.status !== 'active') {
            throw new NotFoundException(`IELTS test with ID "${createCdRegisterDto.cd_test_id}" is not available for registration`);
        }
        if (testModel.seats <= 0) {
            await testModel.update({ status: 'full' });
            throw new NotFoundException(`IELTS test with ID "${createCdRegisterDto.cd_test_id}" has no available seats`);
        }
        const existingRegistration = await this.cdRegisterModel.findOne({
            where: {
                student_id: createCdRegisterDto.student_id,
                cd_test_id: createCdRegisterDto.cd_test_id
            }
        });
        if (existingRegistration) {
            throw new NotFoundException('Student is already registered for this test');
        }
        await testModel.update({ seats: testModel.seats - 1 });
        if (testModel.seats - 1 === 0) {
            await testModel.update({ status: 'full' });
        }
        return this.cdRegisterModel.create({ ...createCdRegisterDto });
    }
    async findAllRegistrations() {
        const registrations = await this.cdRegisterModel.findAll();
        const studentIds = registrations.map(reg => reg.student_id);
        const students = await this.userModel.findAll({
            where: { user_id: studentIds },
            attributes: ['user_id', 'first_name', 'last_name', 'phone', 'username']
        });
        const studentMap = new Map();
        students.forEach(student => {
            studentMap.set(student.user_id, student);
        });
        return registrations.map(registration => {
            const student = studentMap.get(registration.student_id);
            return {
                ...registration.toJSON(),
                student: student ? {
                    id: student.user_id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    phone: student.phone,
                    username: student.username
                } : null
            };
        });
    }
    async findRegistrationsByTest(testId) {
        const registrations = await this.cdRegisterModel.findAll({
            where: { cd_test_id: testId }
        });
        const studentIds = registrations.map(reg => reg.student_id);
        const students = await this.userModel.findAll({
            where: { user_id: studentIds },
            attributes: ['user_id', 'first_name', 'last_name', 'phone', 'username']
        });
        const studentMap = new Map();
        students.forEach(student => {
            studentMap.set(student.user_id, student);
        });
        return registrations.map(registration => {
            const student = studentMap.get(registration.student_id);
            return {
                ...registration.toJSON(),
                student: student ? {
                    id: student.user_id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    phone: student.phone,
                    username: student.username
                } : null
            };
        });
    }
    async findRegistrationsByStudent(studentId) {
        const registrations = await this.cdRegisterModel.findAll({
            where: { student_id: studentId }
        });
        const student = await this.userModel.findOne({
            where: { user_id: studentId },
            attributes: ['user_id', 'first_name', 'last_name', 'phone', 'username']
        });
        const studentData = student ? {
            id: student.user_id,
            first_name: student.first_name,
            last_name: student.last_name,
            phone: student.phone,
            username: student.username
        } : null;
        const testIds = registrations.map(reg => reg.cd_test_id);
        const tests = await this.cdIeltsModel.findAll({
            where: { id: testIds }
        });
        const testMap = new Map();
        tests.forEach(test => {
            testMap.set(test.id, test);
        });
        return registrations.map(registration => {
            const test = testMap.get(registration.cd_test_id);
            return {
                ...registration.toJSON(),
                student: studentData,
                test: test ? test.toJSON() : null
            };
        });
    }
    async findOneRegistration(id) {
        const registration = await this.cdRegisterModel.findByPk(id);
        if (!registration) {
            throw new NotFoundException(`Registration with ID "${id}" not found`);
        }
        const student = await this.userModel.findOne({
            where: { user_id: registration.student_id },
            attributes: ['user_id', 'first_name', 'last_name', 'phone', 'username']
        });
        const test = await this.cdIeltsModel.findByPk(registration.cd_test_id);
        return {
            ...registration.toJSON(),
            student: student ? {
                id: student.user_id,
                first_name: student.first_name,
                last_name: student.last_name,
                phone: student.phone,
                username: student.username
            } : null,
            test: test ? test.toJSON() : null
        };
    }
    async updateRegistration(id, updateCdRegisterDto) {
        const registration = await this.findOneRegistration(id);
        await registration.update(updateCdRegisterDto);
        return registration;
    }
    async removeRegistration(id) {
        const registration = await this.findOneRegistration(id);
        const testModel = await this.cdIeltsModel.findByPk(registration.cd_test_id);
        if (!testModel) {
            throw new NotFoundException(`IELTS test with ID "${registration.cd_test_id}" not found`);
        }
        await testModel.update({
            seats: testModel.seats + 1,
            status: testModel.status === 'full' ? 'active' : testModel.status
        });
        await registration.destroy();
    }
};
CdIeltsService = __decorate([
    Injectable(),
    __param(0, InjectModel(CdIelts)),
    __param(1, InjectModel(CdRegister)),
    __param(2, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CdIeltsService);
export { CdIeltsService };
//# sourceMappingURL=cd-ielts.service.js.map