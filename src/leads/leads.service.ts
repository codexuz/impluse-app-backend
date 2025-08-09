import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
import { Op } from 'sequelize';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead)
    private leadModel: typeof Lead,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    try {
      return await this.leadModel.create({ ...createLeadDto });
    } catch (error) {
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, search?: string, status?: string): Promise<{
    leads: Lead[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { question: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await this.leadModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      leads: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findByPk(id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async findByStatus(status: string): Promise<Lead[]> {
    return await this.leadModel.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByAdminId(adminId: string): Promise<Lead[]> {
    return await this.leadModel.findAll({
      where: { admin_id: adminId },
      order: [['createdAt', 'DESC']],
    });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);
    return await lead.update(updateLeadDto);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await lead.destroy();
  }

  async getLeadStats(): Promise<{
    totalLeads: number;
    leadsByStatus: { [key: string]: number };
    leadsBySource: { [key: string]: number };
  }> {
    const totalLeads = await this.leadModel.count();
    
    const statusStats = await this.leadModel.findAll({
      attributes: [
        'status',
        [this.leadModel.sequelize.fn('COUNT', this.leadModel.sequelize.col('status')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const sourceStats = await this.leadModel.findAll({
      attributes: [
        'source',
        [this.leadModel.sequelize.fn('COUNT', this.leadModel.sequelize.col('source')), 'count']
      ],
      group: ['source'],
      raw: true
    });

    const leadsByStatus = statusStats.reduce((acc: any, stat: any) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});

    const leadsBySource = sourceStats.reduce((acc: any, stat: any) => {
      acc[stat.source] = parseInt(stat.count);
      return acc;
    }, {});

    return {
      totalLeads,
      leadsByStatus,
      leadsBySource
    };
  }
}
