import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadDto } from './dto/update-lead.dto.js';
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
    }>;
    findByStatus(status: string): Promise<import("./entities/lead.entity.js").Lead[]>;
    getMyLeads(user: any): Promise<import("./entities/lead.entity.js").Lead[]>;
    findOne(id: string): Promise<import("./entities/lead.entity.js").Lead>;
    update(id: string, updateLeadDto: UpdateLeadDto): Promise<import("./entities/lead.entity.js").Lead>;
    remove(id: string): Promise<void>;
}
