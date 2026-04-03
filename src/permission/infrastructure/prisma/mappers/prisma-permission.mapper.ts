import { Prisma, Permission as PrismaPermission } from '@prisma/client';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';

export class PrismaPermissionMapper {
  static toDomain(permission: PrismaPermission): Permission {
    const { id, method, ...rest } = permission;
    return Permission.create({ ...rest, method: method as HTTPMethod }, id);
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
