import { Inject, Injectable } from '@nestjs/common';
import {
  Permission,
  PermissionProps,
} from 'src/permission/domain/entities/permission.entity';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}
  async execute(permission: PermissionProps, createdById: number): Promise<Permission> {
    return this.permissionRepository.create(permission, createdById);
  }
}
