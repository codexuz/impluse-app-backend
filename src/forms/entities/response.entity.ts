import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'form_responses',
  timestamps: true,
})
export class Response extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  form_id: string;

  // Store the user's response JSON
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  answers: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
