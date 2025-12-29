import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY } from 'src/role/role.constants';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { Role } from 'src/role/domain/entities/role.entity';

@Injectable()
export class GetRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException({
        message: 'Role not found',
        key: 'ROLE_NOT_FOUND',
      });
    }
    return role;
  }
}
