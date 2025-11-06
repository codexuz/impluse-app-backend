import { Model } from "sequelize-typescript";
export declare class StudentWallet extends Model<StudentWallet> {
    id: string;
    student_id: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
