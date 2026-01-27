import { Module } from '@nestjs/common';
import { GenerateOtpUseCase } from './application/use-cases/generate-otp.use-case';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.use-case';
import { PrismaVerificationCodeRepository } from './infrastructure/repositories/prisma/prisma-verification-code.repository';
import { VERIFICATION_CODE_REPOSITORY } from './verification-code.constants';
import { VerificationCodeConsumer } from './infrastructure/consumers/verification-code.consumer';
import { RabbitMQEventModule } from 'src/shared/infrastructure/message-brokers/rabbitmq/rabbitmq.event.module';

@Module({
  imports: [RabbitMQEventModule],
  providers: [
    GenerateOtpUseCase,
    VerifyOtpUseCase,
    {
      provide: VERIFICATION_CODE_REPOSITORY,
      useClass: PrismaVerificationCodeRepository,
    },
    VerificationCodeConsumer,
  ],
  controllers: [],
  exports: [GenerateOtpUseCase, VerifyOtpUseCase],
})
export class VerificationCodeModule {}
