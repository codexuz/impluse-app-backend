import { Model } from "sequelize-typescript";
export declare class StudentPayment extends Model {
    id: string;
    student_id: string;
    manager_id: string;
    amount: number;
    status: string;
    payment_method: string;
    payment_date: Date;
    next_payment_date: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
