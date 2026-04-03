import { Inject, Injectable } from '@nestjs/common';
import type { IVerificationCodeRepository } from '../../domain/interfaces/verification-code.repository.interface';
import {
  VerificationCode,
  VerificationCodeType,
} from '../../domain/entities/verification-code.entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';
import { VERIFICATION_CODE_REPOSITORY } from 'src/verification-code/verification-code.constants';
import type { EventBus } from 'src/shared/domain/interfaces/event-bus.interface';

import {
  EVENT_BUS,
  OTP_CREATED,
  OTP_EXCHANGE,
} from 'src/shared/shared.constants';

@Injectable()
export class GenerateOtpUseCase {
  constructor(
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    @Inject(EVENT_BUS)
    private readonly eventBus: EventBus,
  ) {}

  async execute(emailStr: string, type: VerificationCodeType): Promise<string> {
    const email = Email.create(emailStr);
    const code = VerificationCode.generateRandomCode(6);

    const verificationCode = VerificationCode.createWithExpiration(
      email,
      code,
      type,
    );

    await this.verificationCodeRepository.save(verificationCode);
    await this.eventBus.publish(OTP_EXCHANGE, OTP_CREATED, {
      email: emailStr,
      code,
      type,
    });

    return code;
  }
}
