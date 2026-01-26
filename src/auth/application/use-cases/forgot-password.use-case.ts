import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { GenerateOtpUseCase } from 'src/verification-code/application/use-cases/generate-otp.use-case';
import { VerificationCodeType } from 'src/verification-code/domain/entities/verification-code.entity';

@Injectable()
export class ForgorPasswordUseCase {
  constructor(
    private readonly generateOtpUseCase: GenerateOtpUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(emailStr: string): Promise<void> {
    const user = await this.userRepository.findByEmail(emailStr);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.generateOtpUseCase.execute(
      emailStr,
      VerificationCodeType.FORGOT_PASSWORD,
    );
  }
}
