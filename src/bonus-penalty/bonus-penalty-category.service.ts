import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBonusPenaltyCategoryDto } from "./dto/create-bonus-penalty-category.dto.js";
import { UpdateBonusPenaltyCategoryDto } from "./dto/update-bonus-penalty-category.dto.js";
import { BonusPenaltyCategory } from "./entities/bonus-penalty-category.entity.js";

@Injectable()
export class BonusPenaltyCategoryService {
  constructor(
    @InjectModel(BonusPenaltyCategory)
    private bonusPenaltyCategoryModel: typeof BonusPenaltyCategory,
  ) {}

  async create(
    createBonusPenaltyCategoryDto: CreateBonusPenaltyCategoryDto,
  ): Promise<BonusPenaltyCategory> {
    return await this.bonusPenaltyCategoryModel.create(
      createBonusPenaltyCategoryDto as any,
    );
  }

  async findAll(type?: string): Promise<BonusPenaltyCategory[]> {
    const where: any = {};
    if (type) {
      where.type = type;
    }
    return await this.bonusPenaltyCategoryModel.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
  }

  async findOne(id: string): Promise<BonusPenaltyCategory> {
    const category = await this.bonusPenaltyCategoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException(
        `Bonus & penalty category with ID "${id}" not found`,
      );
    }

    return category;
  }

  async update(
    id: string,
    updateBonusPenaltyCategoryDto: UpdateBonusPenaltyCategoryDto,
  ): Promise<BonusPenaltyCategory> {
    const category = await this.findOne(id);

    await category.update(updateBonusPenaltyCategoryDto as any);

    return category;
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    await category.destroy(); // Soft delete since paranoid is enabled
  }
}
