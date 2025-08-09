import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'user_notifications',
    timestamps: true,
})
export class UserNotification extends Model {
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
        type: DataType.UUID,
        allowNull: false,
    })
    notification_id: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    seen: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
