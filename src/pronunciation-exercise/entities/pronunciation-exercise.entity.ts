import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'pronunciation_exercises',
  timestamps: true,
})
export class PronunciationExercise extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

   @Column(DataType.UUID)
  speaking_id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  word_to_pronunce: string;

   @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  audio_url: string;

}