import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, updatedById: number): Promise<void> {
    const userExisted = await this.userRepository.findById(id);
    if (!userExisted) {
      throw new NotFoundException({
        message: 'User not found',
        key: 'USER_NOT_FOUND',
      });
    }
    await this.userRepository.delete(id, updatedById);
  }
}
