import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/shared/infrastructure/cache/redis/redis.service';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { UserCacheServiceInterface } from 'src/auth/domain/interfaces/user-cache.service.interface';

@Injectable()
export class UserCacheService implements UserCacheServiceInterface {
  constructor(
    private readonly redisService: RedisService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getTokenVersionByUserId(userId: number) {
    const cachedTokenVersion = await this.redisService.getOrSet(
      `token_version:user:${userId}`,
      () => this.userRepository.getTokenVersionByUserId(userId),
      3600,
    );
    return cachedTokenVersion;
  }

  async deleteTokenVersionByUserId(userId: number) {
    await this.redisService.del(`token_version:user:${userId}`);
  }
}
