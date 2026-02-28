import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsReading } from "./ielts-reading.entity.js";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";

@Table({
  tableName: "ielts_reading_reading_parts",
  timestamps: true,
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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
