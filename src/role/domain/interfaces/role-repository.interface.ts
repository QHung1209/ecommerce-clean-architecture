import { Role } from '../entities/role.entity';
import { HTTPMethod } from '@prisma/client';
import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';

export interface IRoleRepository extends IBaseRepository<Role, number> {
  save(role: Role, createdById: number): Promise<Role>;
  getPermissionsByRoleId(
    roleId: number,
  ): Promise<{ path: string; method: HTTPMethod }[] | null>;
  getRolesByPermissionId(permissionId: number): Promise<Role[] | []>;
}
