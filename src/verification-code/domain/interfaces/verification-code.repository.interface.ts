import {
  VerificationCode,
  VerificationCodeType,
} from '../entities/verification-code.entity';

export interface IVerificationCodeRepository {
  save(verificationCode: VerificationCode): Promise<void>;
  findByEmailAndType(
    email: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null>;
  delete(email: string, type: VerificationCodeType): Promise<void>;
}
