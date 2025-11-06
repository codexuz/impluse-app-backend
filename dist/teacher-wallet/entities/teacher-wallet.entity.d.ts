import { Model } from "sequelize-typescript";
export declare class TeacherWallet extends Model<TeacherWallet> {
    id: string;
    teacher_id: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
