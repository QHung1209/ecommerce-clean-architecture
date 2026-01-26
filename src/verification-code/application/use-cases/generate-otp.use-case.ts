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
  VERIFICATION_CODE_CREATED,
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
    const code = this.generateRandomCode(6);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const verificationCode = VerificationCode.create({
      email,
      code,
      type,
      expiresAt,
    });

    await this.verificationCodeRepository.save(verificationCode);
    this.eventBus.publish(VERIFICATION_CODE_CREATED, {
      email: emailStr,
      code,
      type,
    });

    return code;
  }

  private generateRandomCode(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
