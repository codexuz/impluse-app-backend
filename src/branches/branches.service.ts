import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBranchDto } from "./dto/create-branch.dto.js";
import { UpdateBranchDto } from "./dto/update-branch.dto.js";
import { Branch } from "./entities/branch.entity.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch)
    private branchModel: typeof Branch
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    return await this.branchModel.create({
      ...createBranchDto,
    });
  }

  async findAll(): Promise<Branch[]> {
    return await this.branchModel.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["user_id", "username"],
        },
      ],
    });
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findOne({
      where: {
        id,
        status: true,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["user_id", "username"],
        },
      ],
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  async findByOwner(owner_id: string): Promise<Branch[]> {
    return await this.branchModel.findAll({
      where: {
        owner_id,
        status: true,
      },
    });
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id);
    await branch.update(updateBranchDto);
    return branch;
  }

  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    await branch.update({ status: false }); // Soft delete
  }

  async hardRemove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    await branch.destroy();
  }
}
