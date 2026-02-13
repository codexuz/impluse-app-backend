import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";

export enum QuestionType {
  NOTE_COMPLETION = "NOTE_COMPLETION",
  TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN",
  YES_NO_NOT_GIVEN = "YES_NO_NOT_GIVEN",
  MATCHING_INFORMATION = "MATCHING_INFORMATION",
  MATCHING_HEADINGS = "MATCHING_HEADINGS",
  SUMMARY_COMPLETION = "SUMMARY_COMPLETION",
  SUMMARY_COMPLETION_DRAG_DROP = "SUMMARY_COMPLETION_DRAG_DROP",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SENTENCE_COMPLETION = "SENTENCE_COMPLETION",
  SHORT_ANSWER = "SHORT_ANSWER",
  TABLE_COMPLETION = "TABLE_COMPLETION",
  FLOW_CHART_COMPLETION = "FLOW_CHART_COMPLETION",
  DIAGRAM_LABELLING = "DIAGRAM_LABELLING",
  MATCHING_FEATURES = "MATCHING_FEATURES",
  MATCHING_SENTENCE_ENDINGS = "MATCHING_SENTENCE_ENDINGS",
  PLAN_MAP_LABELLING = "PLAN_MAP_LABELLING",
}

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
    allowNull: true,
  })
  questionNumber: number;

  @Column({
    type: DataType.ENUM(...Object.values(QuestionType)),
    allowNull: true,
  })
  type: QuestionType;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  questionText: string;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  instruction: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  context: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  headingOptions: any;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  tableData: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  points: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  explanation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fromPassage: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
