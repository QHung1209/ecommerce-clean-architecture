import { GenerateOtpUseCase } from './generate-otp.use-case';
import { VerificationCodeType } from '../../domain/entities/verification-code.entity';
import type { IVerificationCodeRepository } from '../../domain/interfaces/verification-code.repository.interface';
import type { EventBus } from 'src/shared/domain/interfaces/event-bus.interface';
import { OTP_EXCHANGE, OTP_CREATED } from 'src/shared/shared.constants';

describe('GenerateOtpUseCase', () => {
  let useCase: GenerateOtpUseCase;
  let repo: jest.Mocked<IVerificationCodeRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    repo = { save: jest.fn() } as any;
    eventBus = { publish: jest.fn() } as any;
    useCase = new GenerateOtpUseCase(repo, eventBus);
  });

  it('should generate code, save it, and publish an event', async () => {
    const emailStr = 'test@example.com';
    const type = VerificationCodeType.FORGOT_PASSWORD;

    const code = await useCase.execute(emailStr, type);

    expect(code).toHaveLength(6);
    expect(repo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(OTP_EXCHANGE, OTP_CREATED, expect.objectContaining({
      email: emailStr,
      code,
      type
    }));
  });
});
