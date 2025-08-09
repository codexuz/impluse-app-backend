import { Model } from "sequelize-typescript";
export declare class StudentBookUnit extends Model {
    id: string;
    student_book_id: string;
    unit_id: string;
    title: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
