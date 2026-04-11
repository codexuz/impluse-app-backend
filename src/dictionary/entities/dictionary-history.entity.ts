import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "dictionary_histories",
  timestamps: true,
})
export class DictionaryHistory extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  user_id!: string;

  @Column(DataType.STRING)
  word!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_fallback!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
