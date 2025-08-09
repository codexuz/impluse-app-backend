import { Unit } from "./entities/units.entity.js";
import { CreateUnitDto } from "./dto/create-unit.dto.js";
import { UpdateUnitDto } from "./dto/update-unit.dto.js";
export declare class ModuleService {
    create(createUnitDto: CreateUnitDto): Promise<Unit>;
    findAll(): Promise<Unit[]>;
    findOne(id: string): Promise<Unit>;
    getRoadMapWithProgress(student_id: string): Promise<{
        unit_id: string;
        unit_title: string;
        unit_order: number;
        status: string;
        completed: number;
        total: number;
        percentage: number;
        lessons: any[];
    }[]>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit>;
    remove(id: string): Promise<number>;
    findByCourse(courseId: string, throwIfEmpty?: boolean): Promise<Unit[]>;
    findByCourseWithProgress(courseId: string, studentId?: string): Promise<any[]>;
}
