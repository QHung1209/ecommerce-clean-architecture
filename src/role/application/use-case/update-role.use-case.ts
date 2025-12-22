import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/role/domain/entities/role.entity';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { UpdateRoleDto } from 'src/role/presentation/dto/update-role.dto';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(id: number, role: UpdateRoleDto, updatedById: number): Promise<Role> {
    const roleExisted = await this.roleRepository.findById(id);
    if (!roleExisted) {
      throw new NotFoundException({
        message: 'Role not found',
        key: 'ROLE_NOT_FOUND',
      });
    }
    return this.roleRepository.update(id, role, updatedById);
  }
}
