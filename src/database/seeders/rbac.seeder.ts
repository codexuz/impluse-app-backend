import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity.js';
import { Role } from '../../users/entities/role.model.js';
import { Permission } from '../../users/entities/permission.model.js';
import { UserRole } from '../../users/entities/user-role.model.js';
import { RolePermission } from '../../users/entities/role-permission.model.js';
@Injectable()
export class RBACSeeder {
  private readonly logger = new Logger(RBACSeeder.name);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Permission) private permissionModel: typeof Permission,
    @InjectModel(UserRole) private userRoleModel: typeof UserRole,
    @InjectModel(RolePermission) private rolePermissionModel: typeof RolePermission
  ) {}

  async seed(): Promise<void> {
    try {
      await this.createPermissions();
      await this.createRoles();
      await this.assignPermissionsToRoles();
      await this.createDefaultUsers();
      this.logger.log('RBAC seeding completed successfully');
    } catch (error) {
      this.logger.error('Error seeding RBAC data:', error);
      throw error;
    }
  }

  private async createPermissions(): Promise<void> {
    const permissions = [
      // User permissions
      { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
      { name: 'users:read', resource: 'users', action: 'read', description: 'Read user data' },
      { name: 'users:update', resource: 'users', action: 'update', description: 'Update user data' },
      { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
      
      // Role permissions
      { name: 'roles:create', resource: 'roles', action: 'create', description: 'Create new roles' },
      { name: 'roles:read', resource: 'roles', action: 'read', description: 'Read role data' },
      { name: 'roles:update', resource: 'roles', action: 'update', description: 'Update role data' },
      { name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
      
      // Permission permissions
      { name: 'permissions:create', resource: 'permissions', action: 'create', description: 'Create new permissions' },
      { name: 'permissions:read', resource: 'permissions', action: 'read', description: 'Read permission data' },
      { name: 'permissions:update', resource: 'permissions', action: 'update', description: 'Update permission data' },
      { name: 'permissions:delete', resource: 'permissions', action: 'delete', description: 'Delete permissions' },
      
      // System permissions
      { name: 'system:admin', resource: 'system', action: 'admin', description: 'Full system administration' },
      { name: 'system:read', resource: 'system', action: 'read', description: 'Read system information' },
      
      // Profile permissions
      { name: 'profile:read', resource: 'profile', action: 'read', description: 'Read own profile' },
      { name: 'profile:update', resource: 'profile', action: 'update', description: 'Update own profile' }
    ];

    for (const permission of permissions) {
      await this.permissionModel.findOrCreate({
        where: { name: permission.name },
        defaults: permission
      });
    }

    this.logger.log('Permissions created successfully');
  }

  private async createRoles(): Promise<void> {
    const roles = [
      { name: 'manager', description: 'Manager with full system access' },
      { name: 'admin', description: 'Administrator with management access' },
      { name: 'teacher', description: 'Teacher with limited access' },
      { name: 'student', description: 'Student with basic access' },
      { name: 'support_teacher', description: 'Support teacher with limited access' }
    ];

    for (const role of roles) {
      await this.roleModel.findOrCreate({
        where: { name: role.name },
        defaults: role
      });
    }

    this.logger.log('Roles created successfully');
  }

  private async assignPermissionsToRoles(): Promise<void> {
    const rolePermissions = {
      admin: [
        'users:create', 'users:read', 'users:update', 'users:delete',
        'roles:create', 'roles:read', 'roles:update', 'roles:delete',
        'permissions:create', 'permissions:read', 'permissions:update', 'permissions:delete',
        'system:admin', 'system:read',
        'profile:read', 'profile:update'
      ],
      teacher: [
        'users:create', 'users:read', 'users:update', 'users:delete',
        'roles:read', 'roles:update',
        'permissions:read',
        'system:read',
        'profile:read', 'profile:update'
      ],
      student: [
        'users:read', 'users:update',
        'roles:read',
        'permissions:read',
        'profile:read', 'profile:update'
      ],
      manager: [
        'profile:read', 'profile:update'
      ],
      support_teacher: [
        'profile:read'
      ]
    };

    for (const [roleName, permissionNames] of Object.entries(rolePermissions)) {
      const role = await this.roleModel.findOne({ where: { name: roleName } });
      if (!role) continue;

      for (const permissionName of permissionNames) {
        const permission = await this.permissionModel.findOne({ where: { name: permissionName } });
        if (!permission) continue;

        await this.rolePermissionModel.findOrCreate({
          where: { roleId: role.id, permissionId: permission.id },
          defaults: { roleId: role.id, permissionId: permission.id }
        });
      }
    }

    this.logger.log('Permissions assigned to roles successfully');
  }

  private async createDefaultUsers(): Promise<void> {
    const defaultUsers = [
      {
        phone: '+99890 011 22 44',
        username: 'admin_xusnora',
        first_name: 'Xusnora',
        last_name: 'Admin',
        roleName: 'admin',
        password: 'admin_xusnora' // Plain text password to be hashed
      },
    ];

    for (const userData of defaultUsers) {
      const { roleName, password, ...userInfo } = userData;
      
      // Hash the password using bcrypt
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const [user, created] = await this.userModel.findOrCreate({
        where: { username: userData.username },
        defaults: { ...userInfo, password_hash }
      });

      if (created) {
        const role = await this.roleModel.findOne({ where: { name: roleName } });
        if (role) {
          await this.userRoleModel.create({
            userId: user.user_id,
            roleId: role.id,
            assignedAt: new Date()
          });
        }
      }
    }

    this.logger.log('Default users created successfully');
  }
}