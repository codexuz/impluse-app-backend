import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';


@Table({
    tableName: 'cd_register',
    timestamps: true,
})
export class CdRegister extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    student_id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    cd_test_id: string;

    @Column({
        type: DataType.ENUM('paid', 'pending', 'cancelled'),
        allowNull: false,
    })
    status: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
