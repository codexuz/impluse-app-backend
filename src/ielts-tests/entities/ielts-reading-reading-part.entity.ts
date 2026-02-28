import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";
import { IeltsReading } from "./ielts-reading.entity.js";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";

@Table({
    tableName: "ielts_reading_reading_parts",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["reading_id", "reading_part_id"],
            name: "uq_reading_reading_part",
        },
    ],
})
export class IeltsReadingReadingPart extends Model<IeltsReadingReadingPart> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => IeltsReading)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    reading_id: string;

    @ForeignKey(() => IeltsReadingPart)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    reading_part_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    order: number;

    @BelongsTo(() => IeltsReading)
    reading: IeltsReading;

    @BelongsTo(() => IeltsReadingPart)
    readingPart: IeltsReadingPart;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
