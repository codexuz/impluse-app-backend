import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSupportScheduleDto, UpdateSupportScheduleDto } from './dto/index.js';
import { SupportSchedule } from './entities/support-schedule.entity.js';

@Injectable()
export class SupportSchedulesService {
  constructor(
    @InjectModel(SupportSchedule)
    private supportScheduleModel: typeof SupportSchedule,
  ) {}

  async create(createSupportScheduleDto: CreateSupportScheduleDto): Promise<SupportSchedule> {
    try {
      const supportSchedule = await this.supportScheduleModel.create({ ...createSupportScheduleDto });
      return supportSchedule;
    } catch (error) {
      throw new BadRequestException('Failed to create support schedule', error.message);
    }
  }

  async findAll(): Promise<SupportSchedule[]> {
    return this.supportScheduleModel.findAll({
      order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async findOne(id: string): Promise<SupportSchedule> {
    const supportSchedule = await this.supportScheduleModel.findByPk(id);
    if (!supportSchedule) {
      throw new NotFoundException(`Support schedule with ID ${id} not found`);
    }
    return supportSchedule;
  }

  async findByTeacher(teacherId: string): Promise<SupportSchedule[]> {
    return this.supportScheduleModel.findAll({
      where: { support_teacher_id: teacherId },
      order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async findByGroup(groupId: string): Promise<SupportSchedule[]> {
    return this.supportScheduleModel.findAll({
      where: { group_id: groupId },
      order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SupportSchedule[]> {
    return this.supportScheduleModel.findAll({
      where: {
        schedule_date: {
          $between: [startDate, endDate],
        },
      },
      order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async update(id: string, updateSupportScheduleDto: UpdateSupportScheduleDto): Promise<SupportSchedule> {
    const supportSchedule = await this.findOne(id);
    
    try {
      await supportSchedule.update(updateSupportScheduleDto);
      return supportSchedule;
    } catch (error) {
      throw new BadRequestException('Failed to update support schedule', error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const supportSchedule = await this.findOne(id);
    await supportSchedule.destroy();
  }

  async getScheduleStats(): Promise<{
    totalSchedules: number;
    upcomingSchedules: number;
    pastSchedules: number;
  }> {
    const now = new Date();
    const total = await this.supportScheduleModel.count();
    
    const upcoming = await this.supportScheduleModel.count({
      where: {
        schedule_date: {
          $gte: now,
        },
      },
    });

    return {
      totalSchedules: total,
      upcomingSchedules: upcoming,
      pastSchedules: total - upcoming,
    };
  }
}
