import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from 'src/role/domain/interfaces/role-repository.interface';
import { ROLE_REPOSITORY } from 'src/role/role.constants';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class DeleteRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepository: IRoleRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const roleExisted = await this.roleRepository.findById(id);
    if (!roleExisted) {
      throw new NotFoundException({
        message: 'Role not found',
        key: 'ROLE_NOT_FOUND',
      });
    }
    const usersExisted = await this.userRepository.findByRoleId(id);
    if (usersExisted.length > 0) {
      await Promise.all(
        usersExisted.map((user) => {
          user.detachRole();
          return this.userRepository.save(user);
        }),
      );
    }

    await this.roleRepository.delete(id);
  }
}
