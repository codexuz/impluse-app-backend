import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'group_homework',
    timestamps: true,
})
export class GroupHomework extends Model {
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
    lesson_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    group_id: string; 

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    teacher_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title: string; 

       @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    start_date: Date;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    deadline: Date; 

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
