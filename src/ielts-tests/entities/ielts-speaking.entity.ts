import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsTest } from "./ielts-test.entity.js";
import { IeltsSpeakingPart } from "./ielts-speaking-part.entity.js";

/**
 * A Speaking topic/section (the "test" the AI examiner runs).
 * Mirrors the shape of IeltsWriting: it groups Part 1/2/3 together and
 * can optionally belong to a full IELTS test.
 */
@Table({
  tableName: "ielts_speaking",
  timestamps: true,
})
export class IeltsSpeaking extends Model<IeltsSpeaking> {
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
    type: DataType.ENUM("practice", "mock"),
    allowNull: false,
    defaultValue: "practice",
  })
  mode: "practice" | "mock";

  // Optional Realtime voice for the AI examiner (e.g. "alloy", "verse").
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  voice: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    allowNull: false,
  })
  orderId: number;

  @HasMany(() => IeltsSpeakingPart)
  parts: IeltsSpeakingPart[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
