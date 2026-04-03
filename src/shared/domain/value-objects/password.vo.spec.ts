import { Password } from './password.vo';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const validPassword = 'StrongPassword123';
    const password = Password.create(validPassword);

    expect(password.getValue()).toBe(validPassword);
  });

  it('should throw an error if password is less than 8 characters', () => {
    expect(() => {
      Password.create('Short1');
    }).toThrow('Invalid password: Password must be at least 8 characters long');
  });

  it('should throw an error if password lacks uppercase letter', () => {
    expect(() => {
      Password.create('nouppercase123');
    }).toThrow('Password must contain at least one uppercase letter');
  });

  it('should throw an error if password lacks lowercase letter', () => {
    expect(() => {
      Password.create('NOLOWERCASE123');
    }).toThrow('Password must contain at least one lowercase letter');
  });

  it('should throw an error if password lacks digits', () => {
    expect(() => {
      Password.create('NoDigitsHere');
    }).toThrow('Password must contain at least one digit');
  });

  it('should collect multiple errors if multiple rules are violated', () => {
    expect(() => {
      Password.create('short'); // <8 chars, no uppercase, no numbers
    }).toThrow(
      'Invalid password: Password must be at least 8 characters long, Password must contain at least one uppercase letter, Password must contain at least one digit',
    );
  });
});
