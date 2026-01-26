import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { VerificationCodeType } from 'src/verification-code/domain/entities/verification-code.entity';
import { VerifyOtpUseCase } from 'src/verification-code/application/use-cases/verify-otp.use-case';
import { RESET_PASSWORD_TOKEN_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { IResetPasswordTokenCacheService } from 'src/auth/domain/interfaces/reset-password-token-cache.service.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerifyResetPasswordOtpUseCase {
  constructor(
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(RESET_PASSWORD_TOKEN_CACHE_SERVICE)
    private readonly resetPasswordTokenCacheService: IResetPasswordTokenCacheService,
  ) {}

  async execute(email: string, code: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.verifyOtpUseCase.execute(
      email,
      code,
      VerificationCodeType.FORGOT_PASSWORD,
    );
    const token = uuidv4();
    await this.resetPasswordTokenCacheService.setResetPasswordToken(
      email,
      token,
    );
    return token;
  }
}
