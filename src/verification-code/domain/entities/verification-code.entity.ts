import { BaseEntity } from 'src/shared/domain/entities/entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';

export enum VerificationCodeType {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export interface VerificationCodeProps {
  email: Email;
  code: string;
  type: VerificationCodeType;
  expiresAt: Date;
}

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

  setEmail(email: Email): void {
    this.props.email = email;
  }

  setCode(code: string): void {
    this.props.code = code;
  }

  setType(type: VerificationCodeType): void {
    this.props.type = type;
  }

  setExpiresAt(expiresAt: Date): void {
    this.props.expiresAt = expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  static create(props: VerificationCodeProps, id?: number): VerificationCode {
    return new VerificationCode(props, id);
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
