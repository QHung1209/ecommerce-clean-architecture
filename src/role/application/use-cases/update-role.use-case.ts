import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';
import { Role } from 'src/role/domain/entities/role.entity';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

export interface UpdateRoleCommand {
  name: string;
  description: string;
  permissions: number[];
  isActive: boolean;
}
@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,

    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async execute(id: number, role: UpdateRoleCommand, updatedById: number): Promise<Role> {
    const roleExisted = await this.roleRepository.findById(id);
    if (!roleExisted) {
      throw new NotFoundException({
        message: 'Role not found',
        key: 'ROLE_NOT_FOUND',
      });
    }
    const permissions = await this.permissionRepository.findAllByIds(role.permissions);
    roleExisted.update({
      name: role.name,
      description: role.description,
      permissions,
      isActive: role.isActive,
    });
    return this.roleRepository.save(roleExisted, updatedById);
  }
}
