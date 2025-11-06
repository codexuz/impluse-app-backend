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
                { first_name: { [Op.like]: `%${search}%` } },
                { last_name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { question: { [Op.like]: `%${search}%` } }
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
        const trendsData = await this.getLeadsTrends();
        const conversionRates = await this.getConversionRates();
        const adminPerformance = await this.getAdminPerformance();
        const averageTimeInStatus = await this.getAverageTimeInStatus();
        return {
            totalLeads,
            leadsByStatus,
            leadsBySource,
            trendsData,
            conversionRates,
            adminPerformance,
            averageTimeInStatus
        };
    }
    async getLeadsTrends() {
        const sequelize = this.leadModel.sequelize;
        const dailyTrends = await this.leadModel.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30))
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });
        const weeklyTrends = await this.leadModel.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%u'), 'week'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 90))
                }
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%u')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%u'), 'ASC']],
            raw: true
        });
        const monthlyTrends = await this.leadModel.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m-01'), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
                }
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
            raw: true
        });
        return {
            daily: dailyTrends.map((item) => ({
                date: new Date(item.date).toISOString().split('T')[0],
                count: parseInt(item.count)
            })),
            weekly: weeklyTrends.map((item) => ({
                week: new Date(item.week).toISOString().split('T')[0],
                count: parseInt(item.count)
            })),
            monthly: monthlyTrends.map((item) => ({
                month: new Date(item.month).toISOString().split('T')[0],
                count: parseInt(item.count)
            }))
        };
    }
    async getConversionRates() {
        const sequelize = this.leadModel.sequelize;
        const totalLeads = await this.leadModel.count();
        const enrolledLeads = await this.leadModel.count({
            where: { status: "O'qishga yozildi" }
        });
        const overallRate = totalLeads > 0 ? (enrolledLeads / totalLeads) * 100 : 0;
        const sourceConversions = await this.leadModel.findAll({
            attributes: [
                'source',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
                [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'O\\'qishga yozildi' THEN 1 ELSE 0 END`)), 'converted']
            ],
            group: ['source'],
            raw: true
        });
        const bySource = sourceConversions.map((item) => ({
            source: item.source,
            rate: item.total > 0 ? (parseInt(item.converted) / parseInt(item.total)) * 100 : 0
        }));
        const statusTransitions = await this.leadModel.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });
        const byStatus = [];
        const statuses = [
            "Yangi",
            "Aloqada",
            "Sinovda",
            "Sinovda qatnashdi",
            "Sinovdan ketdi",
            "O'qishga yozildi",
            "Yo'qotildi"
        ];
        for (let i = 0; i < statuses.length - 1; i++) {
            const currentStatus = statuses[i];
            const nextStatus = statuses[i + 1];
            const currentStatusObj = statusTransitions.find((s) => s.status === currentStatus);
            const nextStatusObj = statusTransitions.find((s) => s.status === nextStatus);
            const currentCount = currentStatusObj ? parseInt(currentStatusObj['count']) : 0;
            const nextCount = nextStatusObj ? parseInt(nextStatusObj['count']) : 0;
            const flowCount = Math.min(currentCount, nextCount);
            if (flowCount > 0) {
                byStatus.push({
                    fromStatus: currentStatus,
                    toStatus: nextStatus,
                    count: flowCount
                });
            }
        }
        return {
            overall: overallRate,
            bySource,
            byStatus
        };
    }
    async getAdminPerformance() {
        const sequelize = this.leadModel.sequelize;
        const adminStats = await this.leadModel.findAll({
            attributes: [
                'admin_id',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
                [sequelize.fn('SUM', sequelize.literal(`CASE WHEN status = 'O\\'qishga yozildi' THEN 1 ELSE 0 END`)), 'converted']
            ],
            group: ['admin_id'],
            raw: true
        });
        return adminStats.map((item) => {
            const leadsCount = parseInt(item.total);
            const convertedCount = parseInt(item.converted);
            return {
                adminId: item.admin_id,
                leadsCount,
                convertedCount,
                conversionRate: leadsCount > 0 ? (convertedCount / leadsCount) * 100 : 0
            };
        });
    }
    async getAverageTimeInStatus() {
        const sequelize = this.leadModel.sequelize;
        const statusTimes = await this.leadModel.findAll({
            attributes: [
                'status',
                [sequelize.fn('AVG', sequelize.fn('DATEDIFF', 'day', sequelize.col('createdAt'), sequelize.col('updatedAt'))), 'avgTime']
            ],
            group: ['status'],
            raw: true
        });
        return statusTimes.map((item) => ({
            status: item.status,
            averageDays: parseFloat(item.avgTime) || 0
        }));
    }
    async getLeadStatsByDateRange(startDate, endDate) {
        const sequelize = this.leadModel.sequelize;
        const totalLeads = await this.leadModel.count({
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        const statusStats = await this.leadModel.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('status')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['status'],
            raw: true
        });
        const sourceStats = await this.leadModel.findAll({
            attributes: [
                'source',
                [sequelize.fn('COUNT', sequelize.col('source')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: ['source'],
            raw: true
        });
        const enrolledLeads = await this.leadModel.count({
            where: {
                status: "O'qishga yozildi",
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        const dailyTrends = await this.leadModel.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });
        return {
            totalLeads,
            leadsByStatus: statusStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            leadsBySource: sourceStats.reduce((acc, stat) => {
                acc[stat.source] = parseInt(stat.count);
                return acc;
            }, {}),
            conversionRate: totalLeads > 0 ? (enrolledLeads / totalLeads) * 100 : 0,
            dailyTrends: dailyTrends.map((item) => ({
                date: new Date(item.date).toISOString().split('T')[0],
                count: parseInt(item.count)
            }))
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