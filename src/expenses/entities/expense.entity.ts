import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from "sequelize-typescript";

@Table({
    tableName: "expenses",
    timestamps: true,
    paranoid: true, // This enables soft delete
})
export class Expense extends Model<Expense> {
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
        type: DataType.UUID,
        allowNull: false,
    })
    category_id: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    amount: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    expense_date: Date;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    teacher_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    reported_by: string;


    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
