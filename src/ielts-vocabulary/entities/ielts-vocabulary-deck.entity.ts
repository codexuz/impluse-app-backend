import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { IeltsVocabulary } from "./ielts-vocabulary.entity.js";
import { IeltsDeckWord } from "./ielts-deck-word.entity.js";

@Table({
  tableName: "ielts_vocabulary_deck",
  timestamps: true,
})
export class IeltsVocabularyDeck extends Model<IeltsVocabularyDeck> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsVocabulary)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ielts_vocabulary_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  vocabulary: IeltsVocabulary;

  words: IeltsDeckWord[];
}
