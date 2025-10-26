import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "uploads",
  timestamps: false,
})
export class Upload extends Model<Upload> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  filename!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
  })
  original_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  mime_type!: string;

  @AllowNull(false)
  @Column({
    type: DataType.BIGINT,
  })
  file_size!: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  file_path!: string;

  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  uploaded_by?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
  })
  upload_type?: string; // 'audio', 'image', 'document', etc.

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  uploaded_at!: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  deleted_at?: Date;
}
