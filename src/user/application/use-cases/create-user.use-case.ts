import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { UserProps } from 'src/user/domain/entities/user.entity';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { CreateUserDto } from 'src/user/presentation/dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(data: CreateUserDto) {
    return this.userRepository.create(data);
  }
}
