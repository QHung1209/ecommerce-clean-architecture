import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HTTPMethod } from '@prisma/client';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import type { IPermissionRepository } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';
export interface UpdatePermissionCommand {
  name: string;
  description: string;
  path: string;
  method: HTTPMethod;
}
@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}
  async execute(
    id: number,
    permission: UpdatePermissionCommand,
    updatedById: number,
  ): Promise<Permission> {
    const permissionExisted = await this.permissionRepository.findById(id);
    if (!permissionExisted) {
      throw new NotFoundException({
        message: 'Permission not found',
        key: 'PERMISSION_NOT_FOUND',
      });
    }
    permissionExisted.update(permission);
    return this.permissionRepository.save(permissionExisted, updatedById);
  }
}
