import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PermissionRepositoryInterface } from "src/permission/domain/interfaces/permission-repository.interface";
import { PERMISSION_REPOSITORY } from "src/permission/permission.constants";

@Injectable()
export class GetPermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ){}   

  async execute(id: number) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException({
        message: 'Permission not found',
        key: 'PERMISSION_NOT_FOUND',
      });
    }
    return permission;
  }
}
