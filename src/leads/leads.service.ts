import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import { UpdateLeadDto } from "./dto/update-lead.dto.js";
import { Lead } from "./entities/lead.entity.js";
import { Op } from "sequelize";

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

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    source?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    leads: Lead[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      isarchived: false,
    };

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { question: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (source) {
      whereClause.source = source;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate,
      };
    }

    const { count, rows } = await this.leadModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      leads: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findAllArchived(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    source?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    leads: Lead[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {
      isarchived: true,
    };

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { question: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (source) {
      whereClause.source = source;
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: endDate,
      };
    }

    const { count, rows } = await this.leadModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
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
      order: [["createdAt", "DESC"]],
    });
  }

  async findByAdminId(adminId: string): Promise<Lead[]> {
    return await this.leadModel.findAll({
      where: { admin_id: adminId },
      order: [["createdAt", "DESC"]],
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

  async archive(id: string): Promise<Lead> {
    const lead = await this.findOne(id);
    return await lead.update({ isarchived: true });
  }

  async unarchive(id: string): Promise<Lead> {
    const lead = await this.findOne(id);
    return await lead.update({ isarchived: false });
  }

  async getLeadStats(): Promise<{
    totalLeads: number;
    leadsByStatus: { [key: string]: number };
    leadsBySource: { [key: string]: number };
    trendsData: {
      daily: { date: string; count: number }[];
      weekly: { week: string; count: number }[];
      monthly: { month: string; count: number }[];
    };
    conversionRates: {
      overall: number;
      bySource: { source: string; rate: number }[];
      byStatus: { fromStatus: string; toStatus: string; count: number }[];
    };
    adminPerformance: {
      adminId: string;
      leadsCount: number;
      convertedCount: number;
      conversionRate: number;
    }[];
    averageTimeInStatus: { status: string; averageDays: number }[];
  }> {
    // Basic statistics
    const totalLeads = await this.leadModel.count();

    const statusStats = await this.leadModel.findAll({
      attributes: [
        "status",
        [
          this.leadModel.sequelize.fn(
            "COUNT",
            this.leadModel.sequelize.col("status"),
          ),
          "count",
        ],
      ],
      group: ["status"],
      raw: true,
    });

    const sourceStats = await this.leadModel.findAll({
      attributes: [
        "source",
        [
          this.leadModel.sequelize.fn(
            "COUNT",
            this.leadModel.sequelize.col("source"),
          ),
          "count",
        ],
      ],
      group: ["source"],
      raw: true,
    });

    const leadsByStatus = statusStats.reduce((acc: any, stat: any) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});

    const leadsBySource = sourceStats.reduce((acc: any, stat: any) => {
      acc[stat.source] = parseInt(stat.count);
      return acc;
    }, {});

    // Trends data
    const trendsData = await this.getLeadsTrends();

    // Conversion rates
    const conversionRates = await this.getConversionRates();

    // Admin performance
    const adminPerformance = await this.getAdminPerformance();

    // Average time in status
    const averageTimeInStatus = await this.getAverageTimeInStatus();

    return {
      totalLeads,
      leadsByStatus,
      leadsBySource,
      trendsData,
      conversionRates,
      adminPerformance,
      averageTimeInStatus,
    };
  }

  /**
   * Get leads trends over time (daily, weekly, monthly)
   */
  async getLeadsTrends(): Promise<{
    daily: { date: string; count: number }[];
    weekly: { week: string; count: number }[];
    monthly: { month: string; count: number }[];
  }> {
    const sequelize = this.leadModel.sequelize;

    // Daily trends for the last 30 days
    const dailyTrends = await this.leadModel.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Weekly trends
    const weeklyTrends = await this.leadModel.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 90)),
        },
      },
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%u")],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%u"),
          "ASC",
        ],
      ],
      raw: true,
    });

    // Monthly trends
    const monthlyTrends = await this.leadModel.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-01"),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m")],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m"),
          "ASC",
        ],
      ],
      raw: true,
    });

    return {
      daily: dailyTrends.map((item: any) => ({
        date: new Date(item.date).toISOString().split("T")[0],
        count: parseInt(item.count),
      })),
      weekly: weeklyTrends.map((item: any) => ({
        week: new Date(item.week).toISOString().split("T")[0],
        count: parseInt(item.count),
      })),
      monthly: monthlyTrends.map((item: any) => ({
        month: new Date(item.month).toISOString().split("T")[0],
        count: parseInt(item.count),
      })),
    };
  }

  /**
   * Calculate conversion rates from leads to enrolled students
   */
  async getConversionRates(): Promise<{
    overall: number;
    bySource: { source: string; rate: number }[];
    byStatus: { fromStatus: string; toStatus: string; count: number }[];
  }> {
    const sequelize = this.leadModel.sequelize;

    // Overall conversion rate (leads to enrolled)
    const totalLeads = await this.leadModel.count();
    const enrolledLeads = await this.leadModel.count({
      where: { status: "O'qishga yozildi" },
    });

    const overallRate = totalLeads > 0 ? (enrolledLeads / totalLeads) * 100 : 0;

    // Conversion rate by source
    const sourceConversions = await this.leadModel.findAll({
      attributes: [
        "source",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              `CASE WHEN status = 'O\\'qishga yozildi' THEN 1 ELSE 0 END`,
            ),
          ),
          "converted",
        ],
      ],
      group: ["source"],
      raw: true,
    });

    const bySource = sourceConversions.map((item: any) => ({
      source: item.source,
      rate:
        item.total > 0
          ? (parseInt(item.converted) / parseInt(item.total)) * 100
          : 0,
    }));

    // Status transitions analysis
    // This is an estimation since we don't track actual status changes
    const statusTransitions = await this.leadModel.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    // Create a simple flow estimation model
    const byStatus = [];
    const statuses = [
      "Yangi",
      "Aloqada",
      "Sinovda",
      "Sinovda qatnashdi",
      "Sinovdan ketdi",
      "O'qishga yozildi",
      "Yo'qotildi",
    ];

    // Create a transition matrix based on status counts
    for (let i = 0; i < statuses.length - 1; i++) {
      const currentStatus = statuses[i];
      const nextStatus = statuses[i + 1];

      // Find counts
      const currentStatusObj = statusTransitions.find(
        (s: any) => s.status === currentStatus,
      );
      const nextStatusObj = statusTransitions.find(
        (s: any) => s.status === nextStatus,
      );
      const currentCount = currentStatusObj
        ? parseInt(currentStatusObj["count"])
        : 0;
      const nextCount = nextStatusObj ? parseInt(nextStatusObj["count"]) : 0;

      // Calculate estimated flow (conservative approach takes the minimum)
      const flowCount = Math.min(currentCount, nextCount);

      if (flowCount > 0) {
        byStatus.push({
          fromStatus: currentStatus,
          toStatus: nextStatus,
          count: flowCount,
        });
      }
    }

    return {
      overall: overallRate,
      bySource,
      byStatus,
    };
  }

  /**
   * Get performance statistics by admin
   */
  async getAdminPerformance(): Promise<
    {
      adminId: string;
      leadsCount: number;
      convertedCount: number;
      conversionRate: number;
    }[]
  > {
    const sequelize = this.leadModel.sequelize;

    const adminStats = await this.leadModel.findAll({
      attributes: [
        "admin_id",
        [sequelize.fn("COUNT", sequelize.col("id")), "total"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              `CASE WHEN status = 'O\\'qishga yozildi' THEN 1 ELSE 0 END`,
            ),
          ),
          "converted",
        ],
      ],
      group: ["admin_id"],
      raw: true,
    });

    return adminStats.map((item: any) => {
      const leadsCount = parseInt(item.total);
      const convertedCount = parseInt(item.converted);
      return {
        adminId: item.admin_id,
        leadsCount,
        convertedCount,
        conversionRate:
          leadsCount > 0 ? (convertedCount / leadsCount) * 100 : 0,
      };
    });
  }

  /**
   * Calculate average time spent in each status
   */
  async getAverageTimeInStatus(): Promise<
    { status: string; averageDays: number }[]
  > {
    // Since we don't track status change history directly,
    // this is an approximation based on the current status and creation/update dates
    const sequelize = this.leadModel.sequelize;

    const statusTimes = await this.leadModel.findAll({
      attributes: [
        "status",
        [
          sequelize.fn(
            "AVG",
            sequelize.fn(
              "DATEDIFF",
              "day",
              sequelize.col("createdAt"),
              sequelize.col("updatedAt"),
            ),
          ),
          "avgTime",
        ],
      ],
      group: ["status"],
      raw: true,
    });

    return statusTimes.map((item: any) => ({
      status: item.status,
      averageDays: parseFloat(item.avgTime) || 0,
    }));
  }

  /**
   * Get detailed lead statistics by date range
   */
  async getLeadStatsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalLeads: number;
    leadsByStatus: { [key: string]: number };
    leadsBySource: { [key: string]: number };
    conversionRate: number;
    dailyTrends: { date: string; count: number }[];
  }> {
    const sequelize = this.leadModel.sequelize;

    // Total leads in date range
    const totalLeads = await this.leadModel.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Status distribution
    const statusStats = await this.leadModel.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["status"],
      raw: true,
    });

    // Source distribution
    const sourceStats = await this.leadModel.findAll({
      attributes: [
        "source",
        [sequelize.fn("COUNT", sequelize.col("source")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["source"],
      raw: true,
    });

    // Conversion rate
    const enrolledLeads = await this.leadModel.count({
      where: {
        status: "O'qishga yozildi",
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Daily trends within range
    const dailyTrends = await this.leadModel.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    return {
      totalLeads,
      leadsByStatus: statusStats.reduce((acc: any, stat: any) => {
        acc[stat.status] = parseInt(stat.count);
        return acc;
      }, {}),
      leadsBySource: sourceStats.reduce((acc: any, stat: any) => {
        acc[stat.source] = parseInt(stat.count);
        return acc;
      }, {}),
      conversionRate: totalLeads > 0 ? (enrolledLeads / totalLeads) * 100 : 0,
      dailyTrends: dailyTrends.map((item: any) => ({
        date: new Date(item.date).toISOString().split("T")[0],
        count: parseInt(item.count),
      })),
    };
  }
}
