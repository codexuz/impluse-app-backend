import { Model } from "sequelize-typescript";
export declare class ExpensesCategory extends Model<ExpensesCategory> {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
