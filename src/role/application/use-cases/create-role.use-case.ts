import { Inject, Injectable } from '@nestjs/common';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { Role } from 'src/role/domain/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/role/role.constants';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
export interface CreateRoleCommand {
  name: string;
  description: string;
  permissions: number[];
  isActive: boolean;
}
@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,

    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async execute(role: CreateRoleCommand, createdById: number): Promise<Role> {
    const permissions = await this.permissionRepository.findAllByIds(
      role.permissions,
    );
    const roleEntity = Role.create({
      name: role.name,
      description: role.description,
      permissions,
      isActive: role.isActive,
    });
    return this.roleRepository.save(roleEntity, createdById);
  }
}
