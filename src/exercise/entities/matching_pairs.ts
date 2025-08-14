import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "matching_exercises",
  timestamps: true,
})
export class MatchingExercise extends Model {
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
  question_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  left_item: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  right_item: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
