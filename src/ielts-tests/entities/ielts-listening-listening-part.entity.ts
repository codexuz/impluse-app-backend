import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsListening } from "./ielts-listening.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";

@Table({
  tableName: "ielts_listening_listening_parts",
  timestamps: true,
})
export class IeltsListeningListeningPart extends Model<IeltsListeningListeningPart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsListening)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  listening_id: string;

  @ForeignKey(() => IeltsListeningPart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  listening_part_id: string;

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
