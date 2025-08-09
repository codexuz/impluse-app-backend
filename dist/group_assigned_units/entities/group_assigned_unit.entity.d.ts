import { Model } from "sequelize-typescript";
export declare class GroupAssignedUnit extends Model {
    id: string;
    status: string;
    group_id: string;
    unit_id: string;
    teacher_id: string;
    createdAt: Date;
    updatedAt: Date;
}
