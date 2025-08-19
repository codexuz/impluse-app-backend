import { User } from '../../users/entities/user.entity.js';
import { Role } from '../../users/entities/role.model.js';
import { Permission } from '../../users/entities/permission.model.js';
import { UserRole } from '../../users/entities/user-role.model.js';
import { RolePermission } from '../../users/entities/role-permission.model.js';
export declare class RBACSeeder {
    private userModel;
    private roleModel;
    private permissionModel;
    private userRoleModel;
    private rolePermissionModel;
    private readonly logger;
    constructor(userModel: typeof User, roleModel: typeof Role, permissionModel: typeof Permission, userRoleModel: typeof UserRole, rolePermissionModel: typeof RolePermission);
    seed(): Promise<void>;
    private createPermissions;
    private createRoles;
    private assignPermissionsToRoles;
    private createDefaultUsers;
}
