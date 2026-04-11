import { Controller, Get, Delete, Param, Query, Request } from "@nestjs/common";
import { DictionaryService } from "./dictionary.service.js";
import { Public } from "../auth/decorators/public.decorator.js";

@Controller("dictionary")
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Public()
  @Get("lookup/:word")
  async lookup(
    @Param("word") word: string,
    @Query("translate") translate: string,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    const shouldTranslate = translate !== "false";
    return this.dictionaryService.lookup(word, userId, shouldTranslate);
  }

  @Get("history")
  async getHistory(
    @Request() req,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.dictionaryService.getUserHistory(
      req.user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Delete("history/:id")
  async deleteHistoryItem(@Request() req, @Param("id") id: string) {
    await this.dictionaryService.deleteHistoryItem(req.user.userId, id);
    return { message: "Deleted" };
  }
}
