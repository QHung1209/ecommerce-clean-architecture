import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/user/user.constants';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { User } from 'src/user/domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        key: 'USER_NOT_FOUND',
      });
    }
    return user;
  }
}
