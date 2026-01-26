import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from 'src/shared/domain/interfaces/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, this.SALT_ROUNDS);
  }

  async compare(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
}
