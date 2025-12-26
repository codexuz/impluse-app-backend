import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContestFeedService } from './contest-feed.service';
import { CreateContestFeedDto } from './dto/create-contest-feed.dto';
import { UpdateContestFeedDto } from './dto/update-contest-feed.dto';

@Controller('contest-feed')
export class ContestFeedController {
  constructor(private readonly contestFeedService: ContestFeedService) {}

  @Post()
  create(@Body() createContestFeedDto: CreateContestFeedDto) {
    return this.contestFeedService.create(createContestFeedDto);
  }

  @Get()
  findAll() {
    return this.contestFeedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestFeedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestFeedDto: UpdateContestFeedDto) {
    return this.contestFeedService.update(+id, updateContestFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestFeedService.remove(+id);
  }
}
