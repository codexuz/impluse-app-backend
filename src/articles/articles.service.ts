import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateArticleDto } from "./dto/create-article.dto.js";
import { UpdateArticleDto } from "./dto/update-article.dto.js";
import { Article } from "./entities/article.entity.js";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article)
    private articleModel: typeof Article
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = await this.articleModel.create({
      ...createArticleDto,
      seenCount: 0,
    });

    return article;
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  async findByCategory(category: string): Promise<Article[]> {
    return this.articleModel.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
    });
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Increment seen count
    await article.increment("seenCount");
    return article.reload();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    await article.update(updateArticleDto);

    return article;
  }

  async remove(id: string): Promise<void> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    await article.destroy();
  }

  async incrementSeenCount(id: string): Promise<Article> {
    const article = await this.articleModel.findByPk(id);

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    await article.increment("seenCount");

    return article.reload();
  }
}
