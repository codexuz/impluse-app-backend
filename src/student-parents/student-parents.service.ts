import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateStudentParentDto } from "./dto/create-student-parent.dto.js";
import { UpdateStudentParentDto } from "./dto/update-student-parent.dto.js";
import { StudentParent } from "./entities/student_parents.entity.js";

@Injectable()
export class StudentParentsService {
  constructor(
    @InjectModel(StudentParent)
    private readonly studentParentModel: typeof StudentParent
  ) {}

  async create(
    createStudentParentDto: CreateStudentParentDto
  ): Promise<StudentParent> {
    try {
      const studentParent = await this.studentParentModel.create({
        ...createStudentParentDto,
      });
      return studentParent;
    } catch (error) {
      throw new InternalServerErrorException("Failed to create student parent");
    }
  }

  async findAll(): Promise<StudentParent[]> {
    try {
      const studentParents = await this.studentParentModel.findAll();
      return studentParents;
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch student parents");
    }
  }

  async findOne(id: string): Promise<StudentParent> {
    try {
      const studentParent = await this.studentParentModel.findByPk(id);
      if (!studentParent) {
        throw new NotFoundException(`Student parent with ID ${id} not found`);
      }
      return studentParent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to fetch student parent");
    }
  }

  async findByStudentId(student_id: string): Promise<StudentParent[]> {
    try {
      const studentParents = await this.studentParentModel.findAll({
        where: { student_id },
      });
      return studentParents;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to fetch student parents by student ID"
      );
    }
  }

  async update(
    id: string,
    updateStudentParentDto: UpdateStudentParentDto
  ): Promise<StudentParent> {
    try {
      const studentParent = await this.findOne(id);
      await studentParent.update(updateStudentParentDto);
      return studentParent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to update student parent");
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const studentParent = await this.findOne(id);
      await studentParent.destroy();
      return { message: `Student parent with ID ${id} has been removed` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Failed to remove student parent");
    }
  }
}
