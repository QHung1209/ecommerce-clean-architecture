import { Inject, Injectable } from '@nestjs/common';
import type { PermissionRepositoryInterface } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';
export interface QueryCommand {
  limit: number;
  page: number;
  search?: string;
}
@Injectable()
export class ListPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async execute(query: QueryCommand) {
    const permissions = await this.permissionRepository.findAll(query);
    const total = await this.permissionRepository.count();
    return {
      permissions,
      total,
      totalPage: Math.ceil(total / query.limit),
      page: query.page,
    };
  }
}
