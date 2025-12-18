import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { UserProps } from 'src/user/domain/entities/user.entity';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(data: UserProps) {
    return this.userRepository.create(data);
  }
}
