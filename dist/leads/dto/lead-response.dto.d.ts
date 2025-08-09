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
}
