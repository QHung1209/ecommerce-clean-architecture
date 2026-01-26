import { Inject, Injectable } from '@nestjs/common';
import { AUTH_JWT_SERVICE } from 'src/auth/auth.constants';
import type { IAuthJwtService } from 'src/auth/domain/interfaces/auth-jwt.service.interface';
import { BcryptPasswordHasher } from 'src/shared/infrastructure/securities/bcrypt-password-hasher.service';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { User } from 'src/user/domain/entities/user.entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';
import { Password } from 'src/shared/domain/value-objects/password.vo';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterCommand {
  email: string;
  password: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: BcryptPasswordHasher,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject(AUTH_JWT_SERVICE)
    private readonly jwtService: IAuthJwtService,
  ) {}

  async execute(command: RegisterCommand) {
    const email = Email.create(command.email);

    const existed = await this.userRepository.findByEmail(email.getValue());
    if (existed) {
      throw new Error('User already exists');
    }

    const rawPassword = Password.create(command.password);
    const hashedPasswordValue = await this.passwordHasher.hash(
      rawPassword.getValue(),
    );

    const user = User.register({
      email,
      password: hashedPasswordValue,
      name: '',
    });

    const savedUser = await this.userRepository.save(user);

    const userId = savedUser.getId();
    if (userId === undefined) {
      throw new Error('User ID is undefined after saving');
    }

    const accessToken = this.jwtService.generateAccessToken(
      userId,
      savedUser.getEmail().getValue(),
      savedUser.getRoleId(),
      uuidv4(),
      savedUser.getTokenVersion(),
    );

    const refreshToken = this.jwtService.generateRefreshToken(
      userId,
      savedUser.getEmail().getValue(),
      savedUser.getRoleId(),
      uuidv4(),
      savedUser.getTokenVersion(),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: savedUser.getEmail().getValue(),
        name: savedUser.getName(),
        roleId: savedUser.getRoleId(),
      },
    };
  }
}
