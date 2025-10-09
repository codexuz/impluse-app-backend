import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';


@Table({
    tableName: 'cd_ielts',
    timestamps: true,
})
export class CdIelts extends Model {
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
    title: string;

    @Column({
        type: DataType.ENUM('active', 'full', 'inactive'),
        allowNull: false,
    })
    status: String;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    exam_date: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    time: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    location: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    seats: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
