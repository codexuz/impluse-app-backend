import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "ielts_audio",
  timestamps: true,
  paranoid: true,
})
export class IeltsAudio extends Model<IeltsAudio> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  file_name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
