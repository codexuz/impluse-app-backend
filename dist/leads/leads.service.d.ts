import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
import { Lead } from './entities/lead.entity.js';
export declare class LeadsService {
    private leadModel;
    constructor(leadModel: typeof Lead);
    create(createLeadDto: CreateLeadDto): Promise<Lead>;
    findAll(page?: number, limit?: number, search?: string, status?: string): Promise<{
        leads: Lead[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    findOne(id: string): Promise<Lead>;
    findByStatus(status: string): Promise<Lead[]>;
    findByAdminId(adminId: string): Promise<Lead[]>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead>;
    remove(id: string): Promise<void>;
    getLeadStats(): Promise<{
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
    getLeadStatsByDateRange(startDate: Date, endDate: Date): Promise<{
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
}
