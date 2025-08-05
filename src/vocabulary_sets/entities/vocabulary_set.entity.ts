import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'vocabulary_set',
    timestamps: true,
})
export class VocabularySet extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    course_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description: string; 

    @Column({
        type: DataType.ENUM("A1", "A2", "B1", "B2", "C1", "C2"),
        allowNull: true,
    })
    level: string; 

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    topic: string; 

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
