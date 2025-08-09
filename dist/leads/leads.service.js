var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Lead } from './entities/lead.entity.js';
import { Op } from 'sequelize';
let LeadsService = class LeadsService {
    constructor(leadModel) {
        this.leadModel = leadModel;
    }
    async create(createLeadDto) {
        try {
            return await this.leadModel.create({ ...createLeadDto });
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, search, status) {
        const offset = (page - 1) * limit;
        const whereClause = {};
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
    async findOne(id) {
        const lead = await this.leadModel.findByPk(id);
        if (!lead) {
            throw new NotFoundException(`Lead with ID ${id} not found`);
        }
        return lead;
    }
    async findByStatus(status) {
        return await this.leadModel.findAll({
            where: { status },
            order: [['createdAt', 'DESC']],
        });
    }
    async findByAdminId(adminId) {
        return await this.leadModel.findAll({
            where: { admin_id: adminId },
            order: [['createdAt', 'DESC']],
        });
    }
    async update(id, updateLeadDto) {
        const lead = await this.findOne(id);
        return await lead.update(updateLeadDto);
    }
    async remove(id) {
        const lead = await this.findOne(id);
        await lead.destroy();
    }
    async getLeadStats() {
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
        const leadsByStatus = statusStats.reduce((acc, stat) => {
            acc[stat.status] = parseInt(stat.count);
            return acc;
        }, {});
        const leadsBySource = sourceStats.reduce((acc, stat) => {
            acc[stat.source] = parseInt(stat.count);
            return acc;
        }, {});
        return {
            totalLeads,
            leadsByStatus,
            leadsBySource
        };
    }
};
LeadsService = __decorate([
    Injectable(),
    __param(0, InjectModel(Lead)),
    __metadata("design:paramtypes", [Object])
], LeadsService);
export { LeadsService };
//# sourceMappingURL=leads.service.js.map