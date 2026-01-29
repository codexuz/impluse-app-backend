import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "questions",
  timestamps: true,
  paranoid: true,
})
export class Questions extends Model {
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
  exercise_id: string;

  @Column({
    type: DataType.ENUM(
      "multiple_choice",
      "fill_in_the_blank",
      "true_false",
      "short_answer",
      "matching",
      "sentence_build", // Added sentence_build as a question type
    ),
    allowNull: false,
  })
  question_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question_text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  points: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_number: number;

  @Column({
    type: DataType.TEXT,
  })
  sample_answer: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
