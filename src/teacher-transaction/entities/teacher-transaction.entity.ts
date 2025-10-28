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
    tableName: "teacher_transactions",
    timestamps: true,
    paranoid: true, // This enables soft delete
})
export class TeacherTransaction extends Model<TeacherTransaction> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    teacher_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    amount: number;

    @Column({
        type: DataType.ENUM("oylik", "jarima", "avans"),
        allowNull: false,
    })
    type: "oylik" | "jarima";
    
    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;
}
