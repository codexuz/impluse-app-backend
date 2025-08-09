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
    }>;
}
