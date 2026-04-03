import { Inject, Injectable } from '@nestjs/common';
import type { IPermissionRepository } from 'src/permission/domain/interfaces/permission-repository.interface';
import { PERMISSION_REPOSITORY } from 'src/permission/permission.constants';

type QueryCommand = {
  limit: number;
  page: number;
  search?: string;
};
@Injectable()
export class ListPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: QueryCommand) {
    const permissions = await this.permissionRepository.findAll(query);
    const total = await this.permissionRepository.count();
    return {
      data: permissions,
      total,
      totalPages: Math.ceil(total / query.limit),
      currentPage: query.page,
    };
  }
}
