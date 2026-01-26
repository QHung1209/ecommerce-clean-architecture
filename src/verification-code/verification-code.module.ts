import { Module } from '@nestjs/common';
import { GenerateOtpUseCase } from './application/use-cases/generate-otp.use-case';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.use-case';
import { PrismaVerificationCodeRepository } from './infrastructure/repositories/prisma/prisma-verification-code.repository';
import { VERIFICATION_CODE_REPOSITORY } from './verification-code.constants';
import { VerificationCodeConsumer } from './infrastructure/consumers/verification-code.consumer';

@Module({
  providers: [
    GenerateOtpUseCase,
    VerifyOtpUseCase,
    {
      provide: VERIFICATION_CODE_REPOSITORY,
      useClass: PrismaVerificationCodeRepository,
    },
  ],
  controllers: [VerificationCodeConsumer],
  exports: [GenerateOtpUseCase, VerifyOtpUseCase],
})
export class VerificationCodeModule {}
