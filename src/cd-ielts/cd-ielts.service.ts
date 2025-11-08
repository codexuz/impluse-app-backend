import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CdIelts } from "./entities/cd-ielt.entity.js";
import { CdRegister } from "./entities/cd-register.entity.js";
import { CreateCdIeltDto } from "./dto/create-cd-ielt.dto.js";
import { UpdateCdIeltDto } from "./dto/update-cd-ielt.dto.js";
import { CreateCdRegisterDto } from "./dto/create-cd-register.dto.js";
import { UpdateCdRegisterDto } from "./dto/update-cd-register.dto.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class CdIeltsService {
  constructor(
    @InjectModel(CdIelts)
    private cdIeltsModel: typeof CdIelts,
    @InjectModel(CdRegister)
    private cdRegisterModel: typeof CdRegister,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  // CD IELTS Test Services
  async createTest(createCdIeltDto: CreateCdIeltDto): Promise<CdIelts> {
    return this.cdIeltsModel.create({ ...createCdIeltDto });
  }

  async findAllTests(): Promise<any[]> {
    const tests = await this.cdIeltsModel.findAll();
    return tests.map((test) => {
      const rawTest = test.toJSON();
      return {
        ...rawTest,
        available_seats: test.seats > 0 ? test.seats : "Fully booked",
      };
    });
  }

  async findActiveTests(): Promise<any[]> {
    const tests = await this.cdIeltsModel.findAll({
      where: {
        status: "active",
        exam_date: {
          [Op.gte]: new Date(), // Only future tests
        },
      },
      order: [["exam_date", "ASC"]], // Closest tests first
    });

    return tests.map((test) => {
      const rawTest = test.toJSON();
      return {
        ...rawTest,
        available_seats: test.seats > 0 ? test.seats : "Fully booked",
      };
    });
  }

  async findOneTest(id: string): Promise<any> {
    const test = await this.cdIeltsModel.findByPk(id);
    if (!test) {
      throw new NotFoundException(`IELTS test with ID "${id}" not found`);
    }

    const rawTest = test.toJSON();
    return {
      ...rawTest,
      available_seats: test.seats > 0 ? test.seats : "Fully booked",
    };
  }

  async updateTest(id: string, updateCdIeltDto: UpdateCdIeltDto): Promise<any> {
    // Get the raw model without our added fields
    const test = await this.cdIeltsModel.findByPk(id);
    if (!test) {
      throw new NotFoundException(`IELTS test with ID "${id}" not found`);
    }

    await test.update(updateCdIeltDto);

    // Return with available_seats information
    const rawTest = test.toJSON();
    return {
      ...rawTest,
      available_seats: test.seats > 0 ? test.seats : "Fully booked",
    };
  }

  async removeTest(id: string): Promise<void> {
    const test = await this.cdIeltsModel.findByPk(id);
    if (!test) {
      throw new NotFoundException(`IELTS test with ID "${id}" not found`);
    }
    await test.destroy();
  }

  // CD IELTS Registration Services
  async registerForTest(
    createCdRegisterDto: CreateCdRegisterDto
  ): Promise<CdRegister> {
    // Get the raw model directly from the database
    const testModel = await this.cdIeltsModel.findByPk(
      createCdRegisterDto.cd_test_id
    );
    if (!testModel) {
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" not found`
      );
    }

    if (testModel.status !== "active") {
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" is not available for registration`
      );
    }

    // Check if there are available seats
    if (testModel.seats <= 0) {
      // Update test status to full if no seats are left
      await testModel.update({ status: "full" });
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" has no available seats`
      );
    }

    // Check if student is already registered for this test
    const existingRegistration = await this.cdRegisterModel.findOne({
      where: {
        student_id: createCdRegisterDto.student_id,
        cd_test_id: createCdRegisterDto.cd_test_id,
      },
    });

    if (existingRegistration) {
      throw new NotFoundException(
        "Student is already registered for this test"
      );
    }

    // Decrement the number of seats
    await testModel.update({ seats: testModel.seats - 1 });

    // If this was the last seat, update status to full
    if (testModel.seats - 1 === 0) {
      await testModel.update({ status: "full" });
    }

    // Create registration
    return this.cdRegisterModel.create({ ...createCdRegisterDto });
  }

  async findAllRegistrations(): Promise<any[]> {
    const registrations = await this.cdRegisterModel.findAll();

    // Get all student data in one query
    const studentIds = registrations.map((reg) => reg.student_id);
    const students = await this.userModel.findAll({
      where: { user_id: studentIds },
      attributes: ["user_id", "first_name", "last_name", "phone", "username"],
    });

    // Create a map for quick lookup
    const studentMap = new Map();
    students.forEach((student) => {
      studentMap.set(student.user_id, student);
    });

    // Combine registration data with student data
    return registrations.map((registration) => {
      const student = studentMap.get(registration.student_id);
      return {
        ...registration.toJSON(),
        student: student
          ? {
              id: student.user_id,
              first_name: student.first_name,
              last_name: student.last_name,
              phone: student.phone,
              username: student.username, // Assuming username is email
            }
          : null,
      };
    });
  }

  async findRegistrationsByTest(testId: string): Promise<any[]> {
    const registrations = await this.cdRegisterModel.findAll({
      where: { cd_test_id: testId },
    });

    // Get all student data in one query
    const studentIds = registrations.map((reg) => reg.student_id);
    const students = await this.userModel.findAll({
      where: { user_id: studentIds },
      attributes: ["user_id", "first_name", "last_name", "phone", "username"],
    });

    // Create a map for quick lookup
    const studentMap = new Map();
    students.forEach((student) => {
      studentMap.set(student.user_id, student);
    });

    // Combine registration data with student data
    return registrations.map((registration) => {
      const student = studentMap.get(registration.student_id);
      return {
        ...registration.toJSON(),
        student: student
          ? {
              id: student.user_id,
              first_name: student.first_name,
              last_name: student.last_name,
              phone: student.phone,
              username: student.username, // Assuming username is email
            }
          : null,
      };
    });
  }

  async findRegistrationsByStudent(studentId: string): Promise<any[]> {
    const registrations = await this.cdRegisterModel.findAll({
      where: { student_id: studentId },
    });

    // Get the student data
    const student = await this.userModel.findOne({
      where: { user_id: studentId },
      attributes: ["user_id", "first_name", "last_name", "phone", "username"],
    });

    const studentData = student
      ? {
          id: student.user_id,
          first_name: student.first_name,
          last_name: student.last_name,
          phone: student.phone,
          username: student.username, // Assuming username is email
        }
      : null;

    // Get test data for each registration
    const testIds = registrations.map((reg) => reg.cd_test_id);
    const tests = await this.cdIeltsModel.findAll({
      where: { id: testIds },
    });

    // Create test lookup map
    const testMap = new Map();
    tests.forEach((test) => {
      testMap.set(test.id, test);
    });

    // Combine registration data with student and test data
    return registrations.map((registration) => {
      const test = testMap.get(registration.cd_test_id);
      return {
        ...registration.toJSON(),
        student: studentData,
        test: test ? test.toJSON() : null,
      };
    });
  }

  async findOneRegistration(id: string): Promise<any> {
    const registration = await this.cdRegisterModel.findByPk(id);
    if (!registration) {
      throw new NotFoundException(`Registration with ID "${id}" not found`);
    }

    // Get the student data
    const student = await this.userModel.findOne({
      where: { user_id: registration.student_id },
      attributes: ["user_id", "first_name", "last_name", "phone", "username"],
    });

    // Get the test data
    const test = await this.cdIeltsModel.findByPk(registration.cd_test_id);

    return {
      ...registration.toJSON(),
      student: student
        ? {
            id: student.user_id,
            first_name: student.first_name,
            last_name: student.last_name,
            phone: student.phone,
            username: student.username, // Assuming username is email
          }
        : null,
      test: test ? test.toJSON() : null,
    };
  }

  async updateRegistration(
    id: string,
    updateCdRegisterDto: UpdateCdRegisterDto
  ): Promise<CdRegister> {
    const registration = await this.cdRegisterModel.findByPk(id);
    if (!registration) {
      throw new NotFoundException(`Registration with ID "${id}" not found`);
    }
    await registration.update(updateCdRegisterDto);
    return registration;
  }

  async removeRegistration(id: string): Promise<void> {
    const registration = await this.cdRegisterModel.findByPk(id);
    if (!registration) {
      throw new NotFoundException(`Registration with ID "${id}" not found`);
    }

    // Get the test to update seat availability - use the model directly
    const testModel = await this.cdIeltsModel.findByPk(registration.cd_test_id);
    if (!testModel) {
      throw new NotFoundException(
        `IELTS test with ID "${registration.cd_test_id}" not found`
      );
    }

    // Increment seats when registration is canceled
    await testModel.update({
      seats: testModel.seats + 1,
      // If the test was previously marked as full but now has a seat, update to active
      status: testModel.status === "full" ? "active" : testModel.status,
    });

    await registration.destroy();
  }
}
