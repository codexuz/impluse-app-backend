import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SequelizeModule } from "@nestjs/sequelize";
import { DictionaryController } from "./dictionary.controller.js";
import { DictionaryService } from "./dictionary.service.js";
import { DictionaryHistory } from "./entities/dictionary-history.entity.js";

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([DictionaryHistory])],
  controllers: [DictionaryController],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
