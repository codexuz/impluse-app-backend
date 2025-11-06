var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RBACSeeder_1;
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity.js';
import { Role } from '../../users/entities/role.model.js';
import { Permission } from '../../users/entities/permission.model.js';
import { UserRole } from '../../users/entities/user-role.model.js';
import { RolePermission } from '../../users/entities/role-permission.model.js';
let RBACSeeder = RBACSeeder_1 = class RBACSeeder {
    constructor(userModel, roleModel, permissionModel, userRoleModel, rolePermissionModel) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.permissionModel = permissionModel;
        this.userRoleModel = userRoleModel;
        this.rolePermissionModel = rolePermissionModel;
        this.logger = new Logger(RBACSeeder_1.name);
    }
    async seed() {
        try {
            await this.createPermissions();
            await this.createRoles();
            await this.assignPermissionsToRoles();
            await this.createDefaultUsers();
            this.logger.log('RBAC seeding completed successfully');
        }
        catch (error) {
            this.logger.error('Error seeding RBAC data:', error);
            throw error;
        }
    }
    async createPermissions() {
        const permissions = [
            { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
            { name: 'users:read', resource: 'users', action: 'read', description: 'Read user data' },
            { name: 'users:update', resource: 'users', action: 'update', description: 'Update user data' },
            { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
            { name: 'roles:create', resource: 'roles', action: 'create', description: 'Create new roles' },
            { name: 'roles:read', resource: 'roles', action: 'read', description: 'Read role data' },
            { name: 'roles:update', resource: 'roles', action: 'update', description: 'Update role data' },
            { name: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles' },
            { name: 'permissions:create', resource: 'permissions', action: 'create', description: 'Create new permissions' },
            { name: 'permissions:read', resource: 'permissions', action: 'read', description: 'Read permission data' },
            { name: 'permissions:update', resource: 'permissions', action: 'update', description: 'Update permission data' },
            { name: 'permissions:delete', resource: 'permissions', action: 'delete', description: 'Delete permissions' },
            { name: 'system:admin', resource: 'system', action: 'admin', description: 'Full system administration' },
            { name: 'system:read', resource: 'system', action: 'read', description: 'Read system information' },
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
    async createRoles() {
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
    async assignPermissionsToRoles() {
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
            if (!role)
                continue;
            for (const permissionName of permissionNames) {
                const permission = await this.permissionModel.findOne({ where: { name: permissionName } });
                if (!permission)
                    continue;
                await this.rolePermissionModel.findOrCreate({
                    where: { roleId: role.id, permissionId: permission.id },
                    defaults: { roleId: role.id, permissionId: permission.id }
                });
            }
        }
        this.logger.log('Permissions assigned to roles successfully');
    }
    async createDefaultUsers() {
        const defaultUsers = [
            {
                phone: '+99890 011 22 44',
                username: 'admin_xusnora',
                first_name: 'Xusnora',
                last_name: 'Admin',
                roleName: 'admin',
                password: 'admin_xusnora'
            },
        ];
        for (const userData of defaultUsers) {
            const { roleName, password, ...userInfo } = userData;
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
};
RBACSeeder = RBACSeeder_1 = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __param(1, InjectModel(Role)),
    __param(2, InjectModel(Permission)),
    __param(3, InjectModel(UserRole)),
    __param(4, InjectModel(RolePermission)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RBACSeeder);
export { RBACSeeder };
//# sourceMappingURL=rbac.seeder.js.map