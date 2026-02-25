import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RESET_PASSWORD_TOKEN_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { IResetPasswordTokenCacheService } from 'src/auth/domain/interfaces/reset-password-token-cache.service.interface';
import type { IPasswordHasher } from 'src/shared/domain/interfaces/password-hasher.interface';
import { Password } from 'src/shared/domain/value-objects/password.vo';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(RESET_PASSWORD_TOKEN_CACHE_SERVICE)
    private readonly resetPasswordTokenCacheService: IResetPasswordTokenCacheService,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(email: string, password: string, token: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cachedToken =
      await this.resetPasswordTokenCacheService.getResetPasswordToken(email);
    if (cachedToken !== token) {
      throw new BadRequestException('Invalid token');
    }
    const rawPassword = Password.create(password);
    const hashedPasswordValue = await this.passwordHasher.hash(
      rawPassword.getValue(),
    );
    user.setPassword(hashedPasswordValue);

    await this.userRepository.save(user);
  }
}
