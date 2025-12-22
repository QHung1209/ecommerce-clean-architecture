import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}
  async execute(
    id: number,
    permission: Partial<PermissionProps>,
    updatedById: number,
  ): Promise<Permission> {
    const permissionExisted = await this.permissionRepository.findById(id);
    if (!permissionExisted) {
      throw new NotFoundException({
        message: 'Permission not found',
        key: 'PERMISSION_NOT_FOUND',
      });
    }
    return this.permissionRepository.update(id, permission, updatedById);
  }
}
