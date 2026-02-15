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
  MULTIPLE_ANSWER = "MULTIPLE_ANSWER",
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
    get() {
      const value = this.getDataValue("headingOptions");
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
      }
      const romanOrder: Record<string, number> = {
        i: 1,
        ii: 2,
        iii: 3,
        iv: 4,
        v: 5,
        vi: 6,
        vii: 7,
        viii: 8,
        ix: 9,
        x: 10,
        xi: 11,
        xii: 12,
        xiii: 13,
        xiv: 14,
        xv: 15,
      };
      const sortedKeys = Object.keys(value).sort((a, b) => {
        const orderA = romanOrder[a.toLowerCase()] ?? 999;
        const orderB = romanOrder[b.toLowerCase()] ?? 999;
        return orderA - orderB;
      });
      const sorted: Record<string, any> = {};
      for (const key of sortedKeys) {
        sorted[key] = value[key];
      }
      return sorted;
    },
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
