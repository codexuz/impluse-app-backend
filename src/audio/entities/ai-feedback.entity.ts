import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Audio } from "./audio.entity.js";

@Table({
  tableName: "ai_feedbacks",
  timestamps: true,
})
export class AIFeedback extends Model<AIFeedback> {
  @AllowNull(false)
  @ForeignKey(() => Audio)
  @Column({
    type: DataType.INTEGER,
  })
  audioId: number;

  @BelongsTo(() => Audio)
  audio: Audio;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  transcript: string;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  grammarScore: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  fluencyWPM: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  fluencyScore: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  vocabDiversity: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  pronScore: number;

  @AllowNull(false)
  @Column({
    type: DataType.FLOAT,
  })
  overallScore: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.FLOAT,
  })
  aiScore: number;

  @AllowNull(false)
  @Default([])
  @Column({
    type: DataType.JSON,
  })
  grammarIssues: any;

  @AllowNull(false)
  @Default([])
  @Column({
    type: DataType.JSON,
  })
  vocabSuggestions: any;

  @AllowNull(false)
  @Default([])
  @Column({
    type: DataType.JSON,
  })
  pronIssues: any;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  naturalness: string;

  @AllowNull(false)
  @Default({})
  @Column({
    type: DataType.JSON,
  })
  fillerWords: any;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  pauseCount: number;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  aiSummary: string;
}
