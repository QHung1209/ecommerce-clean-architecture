import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Email } from 'src/shared/domain/value-objects/email.vo';
import { User, UserProps } from 'src/user/domain/entities/user.entity';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

type UpdateUserCommand = {
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  roleId: number;
};

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, data: UpdateUserCommand): Promise<User> {
    const userExisted = await this.userRepository.findById(id);
    if (!userExisted) {
      throw new NotFoundException({
        message: 'User not found',
        key: 'USER_NOT_FOUND',
      });
    }
    userExisted.updateProfile({
      name: data.name,
      email: Email.create(data.email),
      phoneNumber: data.phoneNumber,
      avatar: data.avatar,
      roleId: data.roleId,
    });
    return await this.userRepository.save(userExisted);
  }
}
