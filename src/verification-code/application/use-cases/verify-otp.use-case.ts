import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IVerificationCodeRepository } from '../../domain/interfaces/verification-code.repository.interface';
import { VerificationCodeType } from '../../domain/entities/verification-code.entity';
import { VERIFICATION_CODE_REPOSITORY } from 'src/verification-code/verification-code.constants';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
  ) {}

  async execute(email: string, code: string, type: VerificationCodeType) {
    const verificationCode =
      await this.verificationCodeRepository.findByEmailAndType(email, type);

    if (!verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    try {
      verificationCode.verify(code);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid verification code',
      );
    }

    await this.verificationCodeRepository.delete(email, type);

    return true;
  }
}
