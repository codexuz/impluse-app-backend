import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CdIelts } from "./entities/cd-ielt.entity.js";
import { CdRegister } from "./entities/cd-register.entity.js";
import { CreateCdIeltDto } from "./dto/create-cd-ielt.dto.js";
import { UpdateCdIeltDto } from "./dto/update-cd-ielt.dto.js";
import { CreateCdRegisterDto } from "./dto/create-cd-register.dto.js";
import { UpdateCdRegisterDto } from "./dto/update-cd-register.dto.js";
import { PaginationDto } from "./dto/pagination.dto.js";
import { FilterTestsDto } from "./dto/filter-tests.dto.js";
import { FilterRegistrationsDto } from "./dto/filter-registrations.dto.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class CdIeltsService {
  constructor(
    @InjectModel(CdIelts)
    private cdIeltsModel: typeof CdIelts,
    @InjectModel(CdRegister)
    private cdRegisterModel: typeof CdRegister,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // CD IELTS Test Services
  async createTest(createCdIeltDto: CreateCdIeltDto): Promise<CdIelts> {
    return this.cdIeltsModel.create({ ...createCdIeltDto });
  }

  async findAllTests(
    filters?: FilterTestsDto,
    pagination?: PaginationDto,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    // Apply filters
    if (filters?.status) {
      whereCondition.status = filters.status;
    }

    if (filters?.location) {
      whereCondition.location = { [Op.like]: `%${filters.location}%` };
    }

    if (filters?.start_date || filters?.end_date) {
      whereCondition.exam_date = {};
      if (filters.start_date) {
        whereCondition.exam_date[Op.gte] = new Date(filters.start_date);
      }
      if (filters.end_date) {
        whereCondition.exam_date[Op.lte] = new Date(filters.end_date);
      }
    }

    // Apply search query
    if (filters?.search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${filters.search}%` } },
        { location: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const { count, rows } = await this.cdIeltsModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["exam_date", "ASC"]],
    });

    const data = rows.map((test) => {
      const rawTest = test.toJSON();
      return {
        ...rawTest,
        available_seats: test.seats > 0 ? test.seats : "Fully booked",
      };
    });

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findActiveTests(pagination?: PaginationDto): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.cdIeltsModel.findAndCountAll({
      where: {
        status: "active",
        exam_date: {
          [Op.gte]: new Date(), // Only future tests
        },
      },
      order: [["exam_date", "ASC"]], // Closest tests first
      limit,
      offset,
    });

    const data = rows.map((test) => {
      const rawTest = test.toJSON();
      return {
        ...rawTest,
        available_seats: test.seats > 0 ? test.seats : "Fully booked",
      };
    });

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
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
    createCdRegisterDto: CreateCdRegisterDto,
  ): Promise<CdRegister> {
    // Get the raw model directly from the database
    const testModel = await this.cdIeltsModel.findByPk(
      createCdRegisterDto.cd_test_id,
    );
    if (!testModel) {
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" not found`,
      );
    }

    if (testModel.status !== "active") {
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" is not available for registration`,
      );
    }

    // Check if there are available seats
    if (testModel.seats <= 0) {
      // Update test status to full if no seats are left
      await testModel.update({ status: "full" });
      throw new NotFoundException(
        `IELTS test with ID "${createCdRegisterDto.cd_test_id}" has no available seats`,
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
        "Student is already registered for this test",
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

  async findAllRegistrations(
    filters?: FilterRegistrationsDto,
    pagination?: PaginationDto,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const whereCondition: any = {};

    // Apply filters
    if (filters?.student_id) {
      whereCondition.student_id = filters.student_id;
    }

    if (filters?.cd_test_id) {
      whereCondition.cd_test_id = filters.cd_test_id;
    }

    if (filters?.status) {
      whereCondition.status = filters.status;
    }

    const { count, rows } = await this.cdRegisterModel.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    // Get all student data in one query
    const studentIds = rows.map((reg) => reg.student_id);

    const studentWhereCondition: any = { user_id: studentIds };

    // Apply search filter for students
    if (filters?.search) {
      studentWhereCondition[Op.or] = [
        { first_name: { [Op.like]: `%${filters.search}%` } },
        { last_name: { [Op.like]: `%${filters.search}%` } },
        { phone: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    const students = await this.userModel.findAll({
      where: studentWhereCondition,
      attributes: ["user_id", "first_name", "last_name", "phone", "username"],
    });

    // Create a map for quick lookup
    const studentMap = new Map();
    students.forEach((student) => {
      studentMap.set(student.user_id, student);
    });

    // Filter registrations based on student search if applied
    let filteredRows = rows;
    if (filters?.search) {
      filteredRows = rows.filter((reg) => studentMap.has(reg.student_id));
    }

    // Combine registration data with student data
    const data = filteredRows.map((registration) => {
      const student = studentMap.get(registration.student_id);
      return {
        ...registration.toJSON(),
        student: student
          ? {
              id: student.user_id,
              first_name: student.first_name,
              last_name: student.last_name,
              phone: student.phone,
              username: student.username,
            }
          : null,
      };
    });

    return {
      data,
      total: filters?.search ? filteredRows.length : count,
      page,
      limit,
      totalPages: Math.ceil(
        (filters?.search ? filteredRows.length : count) / limit,
      ),
    };
  }

  async findRegistrationsByTest(
    testId: string,
    pagination?: PaginationDto,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.cdRegisterModel.findAndCountAll({
      where: { cd_test_id: testId },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    // Get all student data in one query
    const studentIds = rows.map((reg) => reg.student_id);
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
    const data = rows.map((registration) => {
      const student = studentMap.get(registration.student_id);
      return {
        ...registration.toJSON(),
        student: student
          ? {
              id: student.user_id,
              first_name: student.first_name,
              last_name: student.last_name,
              phone: student.phone,
              username: student.username,
            }
          : null,
      };
    });

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findRegistrationsByStudent(
    studentId: string,
    pagination?: PaginationDto,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.cdRegisterModel.findAndCountAll({
      where: { student_id: studentId },
      limit,
      offset,
      order: [["created_at", "DESC"]],
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
          username: student.username,
        }
      : null;

    // Get test data for each registration
    const testIds = rows.map((reg) => reg.cd_test_id);
    const tests = await this.cdIeltsModel.findAll({
      where: { id: testIds },
    });

    // Create test lookup map
    const testMap = new Map();
    tests.forEach((test) => {
      testMap.set(test.id, test);
    });

    // Combine registration data with student and test data
    const data = rows.map((registration) => {
      const test = testMap.get(registration.cd_test_id);
      return {
        ...registration.toJSON(),
        student: studentData,
        test: test ? test.toJSON() : null,
      };
    });

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
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
    updateCdRegisterDto: UpdateCdRegisterDto,
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
        `IELTS test with ID "${registration.cd_test_id}" not found`,
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
