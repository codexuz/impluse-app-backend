import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpeakingService } from './speaking.service.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('speaking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('speaking')
export class SpeakingController {
  constructor(private readonly speakingService: SpeakingService) {}

  @Post()
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Create speaking exercise' })
  @ApiResponse({ status: 201, description: 'Successfully created.' })
  create(@Body() createSpeakingDto: CreateSpeakingDto) {
    return this.speakingService.create(createSpeakingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all speaking exercises' })
  @ApiResponse({ status: 200, description: 'Return all speaking exercises.' })
  findAll() {
    return this.speakingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get speaking exercise by id' })
  @ApiResponse({ status: 200, description: 'Return speaking exercise.' })
  findOne(@Param('id') id: string) {
    return this.speakingService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'teacher')
  @ApiOperation({ summary: 'Update speaking exercise' })
  @ApiResponse({ status: 200, description: 'Successfully updated.' })
  update(@Param('id') id: string, @Body() updateSpeakingDto: UpdateSpeakingDto) {
    return this.speakingService.update(id, updateSpeakingDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete speaking exercise' })
  @ApiResponse({ status: 200, description: 'Successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.speakingService.remove(id);
  }
}