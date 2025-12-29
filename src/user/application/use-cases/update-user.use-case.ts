import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(id: number, data: Partial<UserProps>): Promise<User> {
    const userExisted = await this.userRepository.findById(id);
    if (!userExisted) {
      throw new NotFoundException({
        message: 'User not found',
        key: 'USER_NOT_FOUND',
      });
    }
    return this.userRepository.update(id, data as UserProps);
  }
}
