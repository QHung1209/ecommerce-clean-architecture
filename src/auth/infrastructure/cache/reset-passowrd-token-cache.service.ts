import { Injectable } from '@nestjs/common';
import { IResetPasswordTokenCacheService } from 'src/auth/domain/interfaces/reset-password-token-cache.service.interface';
import { RedisService } from 'src/shared/infrastructure/cache/redis/redis.service';

@Injectable()
export class ResetPasswordTokenCacheService implements IResetPasswordTokenCacheService {
  constructor(private readonly redisService: RedisService) {}

  async getResetPasswordToken(email: string): Promise<string | null> {
    const token = await this.redisService.get<string>(
      `reset-password-token:${email}`,
    );
    return token;
  }

  async setResetPasswordToken(email: string, token: string): Promise<void> {
    await this.redisService.set(`reset-password-token:${email}`, token);
  }
}
