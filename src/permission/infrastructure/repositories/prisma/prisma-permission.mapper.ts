import { Prisma, Permission as PrismaPermission } from '@prisma/client';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';

export class PrismaPermissionMapper {
  static toDomain(permission: PrismaPermission): Permission {
    const { id, ...rest } = permission;
    return Permission.create(rest, id);
  }

  static toPersistence(
    permission: PermissionProps,
    id?: number, 
  ): Prisma.PermissionUncheckedCreateInput {
    return {
      id,
      ...permission,
    };
  }
}
