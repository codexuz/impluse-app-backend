export declare class LeadResponseDto {
    id: string;
    phone: string;
    question: string;
    first_name: string;
    last_name: string;
    status: string;
    source: string;
    course_id: string;
    admin_id: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class LeadListResponseDto {
    leads: LeadResponseDto[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export declare class LeadStatsResponseDto {
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
}
