import { Model } from "sequelize-typescript";
export declare class TeacherTransaction extends Model<TeacherTransaction> {
    id: string;
    teacher_id: string;
    amount: number;
    type: "oylik" | "jarima";
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
