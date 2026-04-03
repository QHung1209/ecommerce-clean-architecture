import { VerifyOtpUseCase } from './verify-otp.use-case';
import {
  VerificationCode,
  VerificationCodeType,
} from '../../domain/entities/verification-code.entity';
import { BadRequestException } from '@nestjs/common';
import type { IVerificationCodeRepository } from '../../domain/interfaces/verification-code.repository.interface';
import { Email } from 'src/shared/domain/value-objects/email.vo';

describe('VerifyOtpUseCase', () => {
  let useCase: VerifyOtpUseCase;
  let repo: jest.Mocked<IVerificationCodeRepository>;

  beforeEach(() => {
    repo = {
      findByEmailAndType: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    useCase = new VerifyOtpUseCase(repo);
  });

  const email = 'test@example.com';
  const code = '123456';
  const type = VerificationCodeType.FORGOT_PASSWORD;

  it('should successfully verify OTP and delete it from DB', async () => {
    const vc = VerificationCode.createWithExpiration(
      Email.create(email),
      code,
      type,
      5,
    );
    repo.findByEmailAndType.mockResolvedValue(vc);

    const result = await useCase.execute(email, code, type);

    expect(result).toBe(true);
    expect(repo.delete).toHaveBeenCalledWith(email, type);
  });

  it('should throw BadRequestException if code is not found', async () => {
    repo.findByEmailAndType.mockResolvedValue(null);
    await expect(useCase.execute(email, code, type)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if code is wrong or expired', async () => {
    const vc = VerificationCode.createWithExpiration(
      Email.create(email),
      '999999',
      type,
      5,
    );
    repo.findByEmailAndType.mockResolvedValue(vc);

    // Entity verify() throws error, UseCase catches and throws BadRequestException
    await expect(useCase.execute(email, code, type)).rejects.toThrow(
      BadRequestException,
    );
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
