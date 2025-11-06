import { ModuleService } from './module.service.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    create(createUnitDto: CreateUnitDto): Promise<import("./entities/units.entity.js").Unit>;
    findAll(): Promise<import("./entities/units.entity.js").Unit[]>;
    findOne(id: string): Promise<import("./entities/units.entity.js").Unit>;
    getProgress(student_id: string): Promise<{
        unit_id: string;
        unit_title: string;
        unit_order: number;
        status: string;
        completed: number;
        total: number;
        percentage: number;
        lessons: any[];
    }[]>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<import("./entities/units.entity.js").Unit>;
    remove(id: string): Promise<number>;
    findByCourse(courseId: string): Promise<import("./entities/units.entity.js").Unit[]>;
}
