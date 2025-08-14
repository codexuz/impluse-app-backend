import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'vocabulary_item',
    timestamps: true,
})
export class VocabularyItem extends Model {
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
    set_id: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    word: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    uzbek: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    rus: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    example: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    audio_url: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    image_url: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
