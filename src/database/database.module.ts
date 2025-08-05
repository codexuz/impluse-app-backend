import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RBACSeeder } from './seeders/rbac.seeder.js';
import { Role } from '../users/entities/role.model.js';
import { Permission } from '../users/entities/permission.model.js';
import { UserRole } from '../users/entities/user-role.model.js';
import { RolePermission } from '../users/entities/role-permission.model.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([
    User,
    Role,
    Permission,
    UserRole,
    RolePermission
  ])],
  providers: [RBACSeeder],
  exports: [RBACSeeder]
})
export class DatabaseModule {}