import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "typing_exercises",
  timestamps: true,
})
export class TypingExercise extends Model {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  correct_answer: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_case_sensitive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
