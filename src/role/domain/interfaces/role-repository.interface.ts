import { SharedQueryInterface } from 'src/shared/domain/interfaces/query.interface';
import { Role } from '../entities/role.entity';
import { HTTPMethod } from '@prisma/client';
import { BaseRepositoryInterface } from 'src/shared/domain/interfaces/base-repository.interface';

export interface RoleRepositoryInterface extends BaseRepositoryInterface<
  Role,
  number
> {
  save(role: Role, createdById: number): Promise<Role>;
  getPermissionsByRoleId(
    roleId: number,
  ): Promise<{ path: string; method: HTTPMethod }[] | null>;
  getRolesByPermissionId(permissionId: number): Promise<Role[] | []>;
}
