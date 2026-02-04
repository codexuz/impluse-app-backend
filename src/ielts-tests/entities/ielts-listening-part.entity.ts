import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsListening } from "./ielts-listening.entity.js";
import { IeltsQuestion } from "./ielts-question.entity.js";
import { IeltsAudio } from "./ielts-audio.entity.js";

export enum ListeningPart {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
  PART_4 = "PART_4",
}

@Table({
  tableName: "ielts_listening_parts",
  timestamps: true,
})
export class IeltsListeningPart extends Model<IeltsListeningPart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsListening)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  listening_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ListeningPart)),
    allowNull: false,
  })
  part: ListeningPart;

  @ForeignKey(() => IeltsAudio)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  audio_id: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  answers: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
