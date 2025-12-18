import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ArticlesService } from "./articles.service.js";
import { ArticlesController } from "./articles.controller.js";
import { Article } from "./entities/article.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([Article])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
