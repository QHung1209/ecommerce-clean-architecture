import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create an email object if email is valid', () => {
    const validEmailStr = 'test@example.com';
    const email = Email.create(validEmailStr);

    expect(email.getValue()).toBe(validEmailStr);
  });

  it('should normalize or retain valid uppercase emails', () => {
    const email = Email.create('TEST@EXAMPLE.COM');
    expect(email.getValue()).toBe('TEST@EXAMPLE.COM');
  });

  it('should throw error if email is invalid', () => {
    expect(() => {
      Email.create('invalid-email');
    }).toThrow('Invalid email');
  });

  it('should throw error if email is empty', () => {
    expect(() => {
      Email.create('');
    }).toThrow('Invalid email');
  });
});
