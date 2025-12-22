import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(id: number): Promise<void> {
    const roleExisted = await this.roleRepository.findById(id);
    if (!roleExisted) {
      throw new NotFoundException({
        message: 'Role not found',
        key: 'ROLE_NOT_FOUND',
      });
    }
    await this.roleRepository.delete(id);
  }
}
