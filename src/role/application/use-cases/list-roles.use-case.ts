import { Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from 'src/role/domain/interfaces/role-repository.interface';
import { Role } from 'src/role/domain/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/role/role.constants';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

type QueryCommand = {
  limit: number;
  page: number;
  search?: string;
};
@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(queryDto: QueryCommand): Promise<PaginatedResult<Role>> {
    const roles = await this.roleRepository.findAll(queryDto);
    const total = await this.roleRepository.count();
    return {
      data: roles,
      total,
      totalPages: Math.ceil(total / queryDto.limit),
      currentPage: queryDto.page,
    };
  }
}
