import { Table, Column, Model, DataType } from "sequelize-typescript";

export enum ArchivedStudentReason {
  NARX_QIMMATLIGI = "Narxning qimmatligi",
  DARS_USULI_YOQMAGANLIGI = "Dars o'tilish usuli yoqmaganligi",
  GURUHDAGI_MUHIT = "Guruhdagi muhit (guruh o'quvchilari)",
  GURUH_DARAJASI = "Guruh darajasi to'g'ri kelmaganligi",
  USTOZ_TASHQI_KORINISHI = "Ustozning tashqi ko'rishni va munosabati",
  MARKAZ_JOYLASHUVI = "Markazning joylashuvi noqulayligi",
  SHAXSIY_MUAMMOLAR = "O'quvchining shaxsiy muammolari tufayli (sog'ligi yoki boshqa)",
  BOSHQA = "Boshqa",
}

@Table({
  tableName: "archived_students",
  timestamps: false,
})
export class ArchivedStudent extends Model {
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
  user_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ArchivedStudentReason)),
    allowNull: false,
  })
  reason: ArchivedStudentReason;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  teacher_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  group_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;
}
