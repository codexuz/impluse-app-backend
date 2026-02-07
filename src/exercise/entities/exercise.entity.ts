import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "exercises",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Exercise extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ENUM("grammar", "reading", "listening", "writing"),
    allowNull: false,
  })
  exercise_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  audio_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  video_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  instructions: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lessonId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
