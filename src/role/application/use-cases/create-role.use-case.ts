import { Inject, Injectable } from '@nestjs/common';
import type { RoleRepositoryInterface } from 'src/role/domain/interfaces/role-repository.interface';
import { CreateRoleDto } from 'src/role/presentation/dto/create-role.dto';
import { Role } from 'src/role/domain/entities/role.entity';
import { ROLE_REPOSITORY } from 'src/role/role.constants';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async execute(role: CreateRoleDto, createdById: number): Promise<Role> {
    return this.roleRepository.create(role, createdById);
  }
}
