import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { IeltsVocabularyDeck } from "./ielts-vocabulary-deck.entity.js";

@Table({
  tableName: "ielts_vocabulary",
  timestamps: true,
})
export class IeltsVocabulary extends Model<IeltsVocabulary> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @HasMany(() => IeltsVocabularyDeck, {
    foreignKey: "ielts_vocabulary_id",
    as: "decks",
  })
  decks: IeltsVocabularyDeck[];
}
