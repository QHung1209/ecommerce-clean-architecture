export class Password {
  private constructor(private readonly value: string) {
    const errors = this.validate(value);
    if (errors.length > 0) {
      throw new Error(`Invalid password: ${errors.join(', ')}`);
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(raw: string): Password {
    return new Password(raw);
  }

  private validate(raw: string): string[] {
    const errors: string[] = [];

    if (!raw || raw.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(raw)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(raw)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(raw)) {
      errors.push('Password must contain at least one digit');
    }

    return errors;
  }
}
