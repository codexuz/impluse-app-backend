import { Model } from 'sequelize-typescript';
export declare class CdRegister extends Model {
    id: string;
    student_id: string;
    cd_test_id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
