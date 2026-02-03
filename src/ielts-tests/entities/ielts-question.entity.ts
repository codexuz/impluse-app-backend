import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";
import { IeltsQuestionContent } from "./ielts-question-content.entity.js";

@Table({
  tableName: "ielts_questions",
  timestamps: true,
})
export class IeltsQuestion extends Model<IeltsQuestion> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsReadingPart)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  reading_part_id: string;

  @ForeignKey(() => IeltsListeningPart)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  listening_part_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
  })
  number_of_questions: number;

  @BelongsTo(() => IeltsReadingPart)
  readingPart: IeltsReadingPart;

  @BelongsTo(() => IeltsListeningPart)
  listeningPart: IeltsListeningPart;

  @HasMany(() => IeltsQuestionContent)
  contents: IeltsQuestionContent[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
