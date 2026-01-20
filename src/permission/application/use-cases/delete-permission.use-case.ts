import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}
  async execute(id: number, userId: number): Promise<void> {
    const permissionExisted = await this.permissionRepository.findById(id);
    if (!permissionExisted) {
      throw new NotFoundException({
        message: 'Permission not found',
        key: 'PERMISSION_NOT_FOUND',
      });
    }
    const roles = await this.roleRepository.getRolesByPermissionId(id);
    await Promise.all(
      roles.map(async (role) => {
        role.removePermission(id);
        return this.roleRepository.save(role, userId);
      }),
    );
    await this.permissionRepository.delete(id);
  }
}
