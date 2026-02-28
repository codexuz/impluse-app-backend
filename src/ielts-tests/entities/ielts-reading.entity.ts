import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsTest } from "./ielts-test.entity.js";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";
import { IeltsReadingReadingPart } from "./ielts-reading-reading-part.entity.js";

@Table({
  tableName: "ielts_reading",
  timestamps: true,
})
export class IeltsReading extends Model<IeltsReading> {
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
  title: string;

  @ForeignKey(() => IeltsTest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  test_id: string;

  @BelongsToMany(() => IeltsReadingPart, () => IeltsReadingReadingPart)
  linkedParts: IeltsReadingPart[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
