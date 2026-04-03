import { Role } from './role.entity';
import { PermissionProps, Permission } from 'src/permission/domain/entities/permission.entity';
import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';

describe('Role Entity', () => {
  it('should create a Role entity successfully', () => {
    const props = { name: 'Admin', description: 'Administrator role', isActive: true };
    const role = Role.create(props);

    expect(role.getName()).toBe('Admin');
    expect(role.getDescription()).toBe('Administrator role');
  });

  it('should remove permissions', () => {
    const permission = Permission.create({ name: 'P1', description: '', path: '/1', method: HTTPMethod.GET }, 1);
    const role = Role.create({ name: 'Admin', description: '', isActive: true, permissions: [permission] });
    
    expect(role.getPermissions()?.length).toBe(1);

    role.removePermission(1);
    expect(role.getPermissions()?.length).toBe(0);
  });
});
