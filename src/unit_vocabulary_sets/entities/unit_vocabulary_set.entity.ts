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
        allowNull: true,
    })
    unit_id: string;

    @Column({
        type: DataType.UUID,
        allowNull: true,
    })
    vocabulary_item_id: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
