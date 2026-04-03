import { BaseEntity } from 'src/shared/domain/entities/entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';

export enum VerificationCodeType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export type VerificationCodeProps = {
  email: Email;
  code: string;
  type: VerificationCodeType;
  expiresAt: Date;
};

const DEFAULT_OTP_EXPIRATION_MINUTES = 5;

export class VerificationCode extends BaseEntity<VerificationCodeProps> {
  constructor(props: VerificationCodeProps, id?: number) {
    super(props, id);
  }

  getEmail(): Email {
    return this.props.email;
  }

  getCode(): string {
    return this.props.code;
  }

  getType(): VerificationCodeType {
    return this.props.type;
  }

  getExpiresAt(): Date {
    return this.props.expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  /**
   * Domain method: verify an OTP code against this verification code.
   * Throws domain errors if code is invalid or expired.
   */
  verify(code: string): void {
    if (this.props.code !== code) {
      throw new Error('Invalid verification code');
    }
    if (this.isExpired()) {
      throw new Error('Verification code expired');
    }
  }

  static create(props: VerificationCodeProps, id?: number): VerificationCode {
    return new VerificationCode(props, id);
  }

  /**
   * Factory method that auto-calculates expiration from domain-owned default.
   */
  static createWithExpiration(
    email: Email,
    code: string,
    type: VerificationCodeType,
    expirationMinutes: number = DEFAULT_OTP_EXPIRATION_MINUTES,
  ): VerificationCode {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
    return new VerificationCode({ email, code, type, expiresAt });
  }

  static generateRandomCode(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
