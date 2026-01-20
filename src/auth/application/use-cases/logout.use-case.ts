import { Inject, Injectable } from '@nestjs/common';
import { AUTH_JWT_SERVICE, TOKEN_CACHE_SERVICE } from 'src/auth/auth.constants';
import type { TokenCacheServiceInterface } from 'src/auth/domain/interfaces/token-cache.service.interface';
import type { AuthJwtServiceInterface } from 'src/auth/domain/interfaces/auth-jwt.service.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_CACHE_SERVICE)
    private readonly tokenCacheService: TokenCacheServiceInterface,
    @Inject(AUTH_JWT_SERVICE)
    private readonly jwtService: AuthJwtServiceInterface,
  ) {}

  async execute(refreshToken: string, accessToken: string): Promise<void> {
    const refreshPayload = this.jwtService.verifyRefreshToken(refreshToken);
    const now = Math.floor(Date.now() / 1000);
    const ttlRefresh = refreshPayload.exp - now;

    const accessPayload = this.jwtService.verifyAccessToken(accessToken);
    const ttlAccess = accessPayload.exp - now;

    await Promise.all([
      this.tokenCacheService.addTokenToBlacklist(refreshPayload.jti, ttlRefresh),
      this.tokenCacheService.addTokenToBlacklist(accessPayload.jti, ttlAccess),
    ]);
  }
}
