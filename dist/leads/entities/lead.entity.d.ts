import { Model } from "sequelize-typescript";
export declare class Lead extends Model {
    id: string;
    phone: string;
    question: string;
    first_name: string;
    last_name: string;
    status: string;
    source: string;
    course_id: string;
    admin_id: string;
    notes: string;
}
