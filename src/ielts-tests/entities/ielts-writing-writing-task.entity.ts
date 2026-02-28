import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";
import { IeltsWriting } from "./ielts-writing.entity.js";
import { IeltsWritingTask } from "./ielts-writing-task.entity.js";

@Table({
    tableName: "ielts_writing_writing_tasks",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["writing_id", "writing_task_id"],
            name: "uq_writing_writing_task",
        },
    ],
})
export class IeltsWritingWritingTask extends Model<IeltsWritingWritingTask> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => IeltsWriting)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    writing_id: string;

    @ForeignKey(() => IeltsWritingTask)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    writing_task_id: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    order: number;

    @BelongsTo(() => IeltsWriting)
    writing: IeltsWriting;

    @BelongsTo(() => IeltsWritingTask)
    writingTask: IeltsWritingTask;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
