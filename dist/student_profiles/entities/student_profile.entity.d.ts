import { Model } from "sequelize-typescript";
export declare class StudentProfile extends Model {
    id: string;
    user_id: string;
    points: number;
    coins: number;
    streaks: number;
    createdAt: Date;
    updatedAt: Date;
}
