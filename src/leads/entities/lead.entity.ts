import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "leads",
  timestamps: true,
  paranoid: true, // This enables soft delete`
})
export class Lead extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.TEXT)
  phone!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  question: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.ENUM(
      "Yangi",
      "Aloqada",
      "Sinovda",
      "Sinovda qatnashdi",
      "Sinovdan ketdi",
      "O'qishga yozildi",
      "Yo'qotildi",
    ),
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.ENUM(
      "Instagram",
      "Telegram",
      "Do'stimdan",
      "O'zim keldim",
      "Flayer",
      "Banner(yondagi)",
      "Banner(ko'chadagi)",
      "Boshqa",
    ),
    allowNull: false,
  })
  source: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  course_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  admin_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string;

   @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isarchived: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  notes: string;
}
