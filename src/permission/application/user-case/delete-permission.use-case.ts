import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';

@Injectable()
export class DeletePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}
  async execute(id: number): Promise<void> {
    const permissionExisted = await this.permissionRepository.findById(id);
    if (!permissionExisted) {
      throw new NotFoundException({
        message: 'Permission not found',
        key: 'PERMISSION_NOT_FOUND',
      });
    }
    await this.permissionRepository.delete(id);
  }
}
