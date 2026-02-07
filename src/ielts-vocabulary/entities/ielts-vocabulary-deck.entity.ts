import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
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

  @BelongsTo(() => IeltsVocabulary, {
    foreignKey: "ielts_vocabulary_id",
    targetKey: "id",
    as: "vocabulary",
  })
  vocabulary: IeltsVocabulary;

  @HasMany(() => IeltsDeckWord, {
    foreignKey: "deck_id",
    as: "words",
  })
  words: IeltsDeckWord[];
}
