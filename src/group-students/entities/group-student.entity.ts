import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity.js';
import { Group } from '../../groups/entities/group.entity.js';


@Table({
    tableName: 'group_students',
    timestamps: true,
})
export class GroupStudent extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @ForeignKey(() => Group)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    group_id: string;

    @BelongsTo(() => Group)
    group: Group;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    student_id: string;

    @BelongsTo(() => User)
    student: User;

     @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    enrolled_at: Date;


     @Column({
        type: DataType.ENUM('active', 'removed', 'completed', 'frozen'),
        allowNull: false,
    })
    status: String;
    
    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
