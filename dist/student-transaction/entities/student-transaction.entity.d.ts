import { Model } from "sequelize-typescript";
export declare class StudentTransaction extends Model<StudentTransaction> {
    id: string;
    student_id: string;
    amount: number;
    type: "lesson_withdrawal" | "payment" | "refund";
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
