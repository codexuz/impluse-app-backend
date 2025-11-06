import { Model } from "sequelize-typescript";
export declare class Expense extends Model<Expense> {
    id: string;
    title: string;
    category_id: string;
    description: string;
    amount: number;
    expense_date: Date;
    teacher_id: string;
    reported_by: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
