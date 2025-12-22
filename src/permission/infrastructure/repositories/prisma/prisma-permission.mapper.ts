import { Prisma, Permission as PrismaPermission } from "@prisma/client";
import { Permission, PermissionProps } from "src/permission/domain/entities/permission.entity";

export class PrismaPermissionMapper {
  static toDomain(permission: PrismaPermission): Permission {
    const { id, ...rest } = permission;
    return new Permission(id, rest as PermissionProps);
  }

  static toPersistence(id: number, permission: PermissionProps): Prisma.PermissionUncheckedCreateInput {
    return {
      id,
      ...permission,
    };
  }
}
