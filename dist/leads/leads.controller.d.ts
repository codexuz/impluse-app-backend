import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { LeadStatsByDateRangeDto } from './dto/lead-stats-date-range.dto.js';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: CreateLeadDto, user: any): Promise<import("./entities/lead.entity.js").Lead>;
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        leads: import("./entities/lead.entity.js").Lead[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getStats(): Promise<{
        totalLeads: number;
        leadsByStatus: {
            [key: string]: number;
        };
        leadsBySource: {
            [key: string]: number;
        };
        trendsData: {
            daily: {
                date: string;
                count: number;
            }[];
            weekly: {
                week: string;
                count: number;
            }[];
            monthly: {
                month: string;
                count: number;
            }[];
        };
        conversionRates: {
            overall: number;
            bySource: {
                source: string;
                rate: number;
            }[];
            byStatus: {
                fromStatus: string;
                toStatus: string;
                count: number;
            }[];
        };
        adminPerformance: {
            adminId: string;
            leadsCount: number;
            convertedCount: number;
            conversionRate: number;
        }[];
        averageTimeInStatus: {
            status: string;
            averageDays: number;
        }[];
    }>;
    getStatsByDateRange(dateRangeDto: LeadStatsByDateRangeDto): Promise<{
        totalLeads: number;
        leadsByStatus: {
            [key: string]: number;
        };
        leadsBySource: {
            [key: string]: number;
        };
        conversionRate: number;
        dailyTrends: {
            date: string;
            count: number;
        }[];
    }>;
    getLeadsTrends(): Promise<{
        daily: {
            date: string;
            count: number;
        }[];
        weekly: {
            week: string;
            count: number;
        }[];
        monthly: {
            month: string;
            count: number;
        }[];
    }>;
    getConversionRates(): Promise<{
        overall: number;
        bySource: {
            source: string;
            rate: number;
        }[];
        byStatus: {
            fromStatus: string;
            toStatus: string;
            count: number;
        }[];
    }>;
    getAdminPerformance(): Promise<{
        adminId: string;
        leadsCount: number;
        convertedCount: number;
        conversionRate: number;
    }[]>;
    getAverageTimeInStatus(): Promise<{
        status: string;
        averageDays: number;
    }[]>;
    findByStatus(status: string): Promise<import("./entities/lead.entity.js").Lead[]>;
    getMyLeads(user: any): Promise<import("./entities/lead.entity.js").Lead[]>;
    findOne(id: string): Promise<import("./entities/lead.entity.js").Lead>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<import("./entities/lead.entity.js").Lead>;
    remove(id: string): Promise<void>;
}
