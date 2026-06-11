import { Table, Column, Model, DataType } from "sequelize-typescript";

/**
 * A practice topic that groups SpeechSuper questions together
 * (e.g. "Hometown", "Work & Study", "Technology").
 */
@Table({
  tableName: "speechsuper_topics",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SpeechSuperTopic extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({
    type: DataType.ENUM("ielts", "general", "pronunciation"),
    allowNull: false,
    defaultValue: "general",
    comment: "Broad category this topic belongs to",
  })
  category: "ielts" | "general" | "pronunciation";

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "CEFR / IELTS band difficulty label, e.g. A2, B1, 5.5",
  })
  level: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image_url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Ordering index for display",
  })
  sort_order: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;
}
