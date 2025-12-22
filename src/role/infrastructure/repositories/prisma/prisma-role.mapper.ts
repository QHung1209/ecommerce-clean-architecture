import {
  Prisma,
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';
import { Permission } from 'src/permission/domain/entities/permission.entity';
import { PrismaPermissionMapper } from 'src/permission/infrastructure/repositories/prisma/prisma-permission.mapper';
import { Role, RoleProps } from 'src/role/domain/entities/role.entity';

export class PrismaRoleMapper {
  static toDomain(role: PrismaRole, permissions: PrismaPermission[]): Role {
    const { id, ...rest } = role;
    const domainPermissions: Permission[] = permissions.map((p) =>
      PrismaPermissionMapper.toDomain(p),
    );
    return new Role(id, {
      ...rest,
      permissions: domainPermissions,
    } as RoleProps);
  }

  static toPersistence(role: Role): Prisma.RoleUncheckedCreateInput {
    return {
      id: role.id,
      name: role.getName(),
      description: role.getDescription(),
      isActive: role.getIsActive(),
      permissions: {
        connect: role.getPermissions().map((permission) => ({
          id: permission.id,
        })),
      },
    };
  }
}
