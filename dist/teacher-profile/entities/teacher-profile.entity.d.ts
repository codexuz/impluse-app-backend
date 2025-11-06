import { Model } from "sequelize-typescript";
export declare class TeacherProfile extends Model<TeacherProfile> {
    id: string;
    user_id: string;
    payment_type: "percentage" | "fixed";
    payment_value: number;
    payment_day: number;
    createdAt: Date;
    updatedAt: Date;
}
