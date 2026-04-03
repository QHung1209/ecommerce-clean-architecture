import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { User } from 'src/user/domain/entities/user.entity';
import { Password } from 'src/shared/domain/value-objects/password.vo';
import { Email } from 'src/shared/domain/value-objects/email.vo';

type CreateUserCommand = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatar?: string;
  roleId: number;
};
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateUserCommand): Promise<User> {
    const existed = await this.userRepository.findByEmail(data.email);
    if (existed) {
      throw new Error('Email already in use');
    }

    const user = User.create({
      name: data.name,
      email: Email.create(data.email),
      password: data.password,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar,
      roleId: data.roleId,
      tokenVersion: 0,
    });

    return this.userRepository.save(user);
  }
}
