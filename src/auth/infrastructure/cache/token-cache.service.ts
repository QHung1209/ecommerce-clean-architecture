import { Injectable } from "@nestjs/common";
import { TokenCacheServiceInterface } from "src/auth/domain/interfaces/token-cache.service.interface";
import { RedisService } from "src/shared/infrastructure/cache/redis/redis.service";

@Injectable()
export class TokenCacheService implements TokenCacheServiceInterface {
    constructor(
        private readonly redisService: RedisService,
    ) {}
    async isTokenBlacklisted(jti: string): Promise<boolean> {
        const token = await this.redisService.get(`blacklist:${jti}`);
        return !!token;
    }
    async addTokenToBlacklist(jti: string, ttl: number): Promise<void> {
        await this.redisService.set(`blacklist:${jti}`, 'true', ttl);
    }
}
