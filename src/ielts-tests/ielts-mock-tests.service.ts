import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { IeltsMockTest } from "./entities/ielts-mock-test.entity.js";
import { CreateMockTestDto } from "./dto/create-mock-test.dto.js";
import { UpdateMockTestDto } from "./dto/update-mock-test.dto.js";
import { User } from "../users/entities/user.entity.js";
import { IeltsTest } from "./entities/ielts-test.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { Op } from "sequelize";

@Injectable()
export class IeltsMockTestsService {
  constructor(
    @InjectModel(IeltsMockTest)
    private readonly mockTestModel: typeof IeltsMockTest,
  ) {}

  async create(dto: CreateMockTestDto): Promise<IeltsMockTest> {
    const defaultMeta = {
      listening_videoUrl:
        "https://18406281-4440-4933-b3cd-7a96648fd82c.srvstatic.uz/uploads/listening.mp4",
      reading_videoUrl:
        "https://18406281-4440-4933-b3cd-7a96648fd82c.srvstatic.uz/uploads/reading.mp4",
      writing_videoUrl:
        "https://18406281-4440-4933-b3cd-7a96648fd82c.srvstatic.uz/uploads/writing.mp4",
    };

    return await this.mockTestModel.create({
      ...dto,
      meta: dto.meta ? { ...defaultMeta, ...dto.meta } : defaultMeta,
    } as any);
  }

  async findAll(query: {
    user_id?: string;
    test_id?: string;
    group_id?: string;
    teacher_id?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (query.user_id) where.user_id = query.user_id;
    if (query.test_id) where.test_id = query.test_id;
    if (query.group_id) where.group_id = query.group_id;
    if (query.teacher_id) where.teacher_id = query.teacher_id;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.mockTestModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["user_id", "firstName", "lastName"],
        },
        {
          model: IeltsTest,
          attributes: ["id", "title", "mode", "status"],
        },
        {
          model: Group,
          attributes: ["id", "name"],
        },
      ],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<IeltsMockTest> {
    const mockTest = await this.mockTestModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["user_id", "firstName", "lastName"],
        },
        {
          model: IeltsTest,
          attributes: ["id", "title", "mode", "status"],
        },
        {
          model: Group,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!mockTest) {
      throw new NotFoundException(`Mock test with ID ${id} not found`);
    }

    return mockTest;
  }

  async update(id: string, dto: UpdateMockTestDto): Promise<IeltsMockTest> {
    const mockTest = await this.findOne(id);
    await mockTest.update(dto as any);
    return mockTest;
  }

  async remove(id: string): Promise<void> {
    const mockTest = await this.findOne(id);
    await mockTest.destroy();
  }

  async archive(id: string): Promise<IeltsMockTest> {
    const mockTest = await this.findOne(id);
    await mockTest.update({ archived: true } as any);
    return mockTest;
  }

  async unarchive(id: string): Promise<IeltsMockTest> {
    const mockTest = await this.findOne(id);
    await mockTest.update({ archived: false } as any);
    return mockTest;
  }

  async findByUser(userId: string) {
    return await this.mockTestModel.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: IeltsTest,
          attributes: ["id", "title", "mode", "status"],
        },
        {
          model: Group,
          attributes: ["id", "name"],
        },
      ],
    });
  }

  async findByGroup(groupId: string) {
    return await this.mockTestModel.findAll({
      where: { group_id: groupId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["user_id", "firstName", "lastName"],
        },
        {
          model: IeltsTest,
          attributes: ["id", "title", "mode", "status"],
        },
      ],
    });
  }
}
