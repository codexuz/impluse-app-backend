import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsTest } from "./ielts-test.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";

@Table({
  tableName: "ielts_listening",
  timestamps: true,
})
export class IeltsListening extends Model<IeltsListening> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => IeltsTest)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  test_id: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  full_audio_url: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @BelongsTo(() => IeltsTest)
  test: IeltsTest;

  @HasMany(() => IeltsListeningPart)
  parts: IeltsListeningPart[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
