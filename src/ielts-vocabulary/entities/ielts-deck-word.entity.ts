import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { IeltsVocabularyDeck } from "./ielts-vocabulary-deck.entity.js";

@Table({
  tableName: "ielts_deck_words",
  timestamps: true,
})
export class IeltsDeckWord extends Model<IeltsDeckWord> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsVocabularyDeck)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  deck_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  word: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  partOfSpeech: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  uzbek: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  rus: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  example: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  definition: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  audio_url: string;

  deck: IeltsVocabularyDeck;
}
