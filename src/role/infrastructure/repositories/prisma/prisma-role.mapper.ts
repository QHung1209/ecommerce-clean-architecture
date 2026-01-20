import {
  Prisma,
  Role as PrismaRole,
  Permission as PrismaPermission,
} from '@prisma/client';
import { Permission } from 'src/permission/domain/entities/permission.entity';
import { PrismaPermissionMapper } from 'src/permission/infrastructure/repositories/prisma/prisma-permission.mapper';
import { Role, RoleProps } from 'src/role/domain/entities/role.entity';

export class PrismaRoleMapper {
  static toDomain(role: PrismaRole, permissions?: PrismaPermission[]): Role {
    const { id, ...rest } = role;
    const domainPermissions: Permission[] | undefined = permissions?.map((p) =>
      PrismaPermissionMapper.toDomain(p),
    );
    return Role.create({
      ...rest,
      permissions: domainPermissions,
    }, id);
  }

  static toCreatePersistence(role: RoleProps, id?: number): Prisma.RoleUncheckedCreateInput {
    return {
      id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      permissions: {
        connect: role.permissions?.map((permission) => ({
          id: permission.getId(),
        })),
      },
    };
  }

  static toUpdatePersistence(role: RoleProps, id?: number): Prisma.RoleUncheckedUpdateInput {
    return {
      id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
      permissions: {
        set: role.permissions?.map((permission) => ({
          id: permission.getId(),
        })),
      },
    };
  }

}
