import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { Response } from './response.entity.js';

@Table({
    tableName: 'forms',
    timestamps: true,
})
export class Form extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    // Store the Vueform schema (JSON)
    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    schema: any;

    // When true, submitting a response requires a verified SMS code
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    smsVerification: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}
