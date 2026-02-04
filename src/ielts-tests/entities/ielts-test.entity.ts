import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "tests",
  timestamps: true,
  paranoid: true,
})
export class IeltsTest extends Model<IeltsTest> {
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

  @Column({
    type: DataType.ENUM("practice", "mock"),
    allowNull: false,
  })
  mode: "practice" | "mock";

  @Column({
    type: DataType.ENUM("draft", "published"),
    allowNull: false,
    defaultValue: "draft",
  })
  status: "draft" | "published";

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  created_by: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
