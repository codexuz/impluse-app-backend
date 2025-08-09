import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'groupAssignedLesson',
    timestamps: true,
})
export class GroupAssignedLesson extends Model {
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
        lesson_id: string;
    
        @Column({
            type: DataType.UUID,
            allowNull: false,
        })
        group_id: string;
    
        @Column({
            type: DataType.UUID,
            allowNull: false,
        })
        granted_by: string;

        @Column({
            type: DataType.UUID,
            allowNull: false
          })
          group_assigned_unit_id: string;
    
        @Column({
            type: DataType.DATEONLY,
            allowNull: false,
        })
        start_from: Date;
    
        @Column({
            type: DataType.DATEONLY,
            allowNull: false,
        })
        end_at: Date;
    
        @Column({
            type: DataType.ENUM('locked', 'unlocked')
        })
        status: string
    
        @CreatedAt
        createdAt: Date;
    
        @UpdatedAt
        updatedAt: Date;
}
