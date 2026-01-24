import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CreateStudentParentDto } from "./dto/create-student-parent.dto.js";
import { UpdateStudentParentDto } from "./dto/update-student-parent.dto.js";
import { QueryStudentParentDto } from "./dto/query-student-parent.dto.js";
import { StudentParentListResponseDto } from "./dto/student-parent-list-response.dto.js";
import { StudentParent } from "./entities/student_parents.entity.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class StudentParentsService {
  constructor(
    @InjectModel(StudentParent)
    private readonly studentParentModel: typeof StudentParent,
  ) {}

  async create(
    createStudentParentDto: CreateStudentParentDto,
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

  async findAll(
    queryDto?: QueryStudentParentDto,
  ): Promise<StudentParentListResponseDto> {
    try {
      const page = queryDto?.page || 1;
      const limit = queryDto?.limit || 10;
      const offset = (page - 1) * limit;

      const where: any = {};
      const studentWhere: any = {};

      // Filter by parent details
      if (queryDto?.parent_name) {
        where.full_name = {
          [Op.iLike]: `%${queryDto.parent_name}%`,
        };
      }

      if (queryDto?.parent_phone) {
        where[Op.or] = [
          { phone_number: { [Op.iLike]: `%${queryDto.parent_phone}%` } },
          { additional_number: { [Op.iLike]: `%${queryDto.parent_phone}%` } },
        ];
      }

      // Filter by student full name
      if (queryDto?.student_name) {
        studentWhere[Op.or] = [
          {
            [Op.and]: [
              { first_name: { [Op.iLike]: `%${queryDto.student_name}%` } },
            ],
          },
          {
            [Op.and]: [
              { last_name: { [Op.iLike]: `%${queryDto.student_name}%` } },
            ],
          },
        ];
      }

      const { count, rows: studentParents } =
        await this.studentParentModel.findAndCountAll({
          where,
          include: [
            {
              model: User,
              as: "student",
              where:
                Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
              attributes: ["user_id", "first_name", "last_name", "phone"],
              required: queryDto?.student_name ? true : false,
            },
          ],
          limit,
          offset,
          distinct: true,
          order: [["createdAt", "DESC"]],
        });

      return {
        data: studentParents,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      console.error("Error fetching student parents:", error);
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
        "Failed to fetch student parents by student ID",
      );
    }
  }

  async update(
    id: string,
    updateStudentParentDto: UpdateStudentParentDto,
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
