import { Inject, Injectable } from '@nestjs/common';
import type { IRoleRepository } from 'src/role/domain/interfaces/role-repository.interface';
import { Role } from 'src/role/domain/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

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

  async execute(queryDto: QueryCommand): Promise<Role[]> {
    return this.roleRepository.findAll(queryDto);
  }
}
