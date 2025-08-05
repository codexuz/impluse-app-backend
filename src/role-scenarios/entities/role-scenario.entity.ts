import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "role_scenario",
  timestamps: true,
})
export class RoleScenario extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.UUID)
  speaking_id!: string;

  @Column(DataType.TEXT)
  bot_sentence!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  user_sentence: string;

}
