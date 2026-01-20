import { Inject, Injectable } from '@nestjs/common';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { Role } from 'src/role/domain/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

export interface QueryCommand {
  limit: number;
  page: number;
  search?: string;
}
@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(queryDto: QueryCommand): Promise<Role[]> {
    return this.roleRepository.findAll(queryDto);
  }
}
