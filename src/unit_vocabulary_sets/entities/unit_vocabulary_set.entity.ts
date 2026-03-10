import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'unit_vocabulary_set',
    timestamps: true,
})
export class UnitVocabularySet extends Model {
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
    vocabulary_set_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    title: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
