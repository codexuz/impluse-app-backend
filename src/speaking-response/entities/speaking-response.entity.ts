import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "speaking_responses",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SpeakingResponse extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.UUID)
  speaking_id!: string;

 @Column(DataType.UUID)
  student_id!: string;

  @Column({
    type: DataType.ENUM('part1', 'part2', 'part3', 'pronunciation'),
    allowNull: false,
    comment: 'Type of speaking response (IELTS speaking part or pronunciation)',
  })
  response_type: 'part1' | 'part2' | 'part3' | 'pronunciation';

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'URLs to the audio recordings',
    defaultValue: []
  })
  audio_url: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Transcription of the audio recording',
  })
  transcription: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: 'General assessment result data',
  })
  result: any;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Overall pronunciation score (0-100)',
  })
  pronunciation_score: number;


  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Feedback on errors and improvement suggestions',
  })
  feedback: string;

}
