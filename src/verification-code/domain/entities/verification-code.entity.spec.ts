import { Email } from 'src/shared/domain/value-objects/email.vo';
import { VerificationCode, VerificationCodeType } from './verification-code.entity';

describe('VerificationCode Entity', () => {
  const email = Email.create('test@example.com');
  const code = '123456';
  const type = VerificationCodeType.FORGOT_PASSWORD;

  it('should create with domain default expiration using factory method', () => {
    const entity = VerificationCode.createWithExpiration(email, code, type);
    
    // Default expiration is 5 minutes
    const diffMinutes = (entity.getExpiresAt().getTime() - Date.now()) / (1000 * 60);
    expect(Math.round(diffMinutes)).toBe(5);
  });

  describe('domain behaviors', () => {
    it('should successfully verify when code is correct and not expired', () => {
      const entity = VerificationCode.createWithExpiration(email, code, type, 5);
      expect(() => entity.verify(code)).not.toThrow();
    });

    it('should throw error when code does not match', () => {
      const entity = VerificationCode.createWithExpiration(email, code, type, 5);
      expect(() => entity.verify('000000')).toThrow('Invalid verification code');
    });

    it('should throw error when code matches but is expired', () => {
      const entity = VerificationCode.createWithExpiration(email, code, type, -1);
      expect(() => entity.verify(code)).toThrow('Verification code expired');
    });
  });

  it('should generate a code of the correct length', () => {
    const generated = VerificationCode.generateRandomCode(6);
    expect(generated).toHaveLength(6);
  });
});
