import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'student_vocabulary_progress',
    timestamps: true,
})
export class StudentVocabularyProgress extends Model {
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
    student_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    vocabulary_item_id: string;

    @Column({
        type: DataType.ENUM('learning', 'reviewing', 'mastered'),
        allowNull: false,
    })
    status: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
