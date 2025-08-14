import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'groups',
    timestamps: true,
})
export class Group extends Model {
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
    name: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    teacher_id: string; // FK to User where role = 'teacher'

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    level_id: string; // FK to Level

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
