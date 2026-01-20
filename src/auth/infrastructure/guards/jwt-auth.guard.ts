import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  AUTH_JWT_SERVICE,
  TOKEN_CACHE_SERVICE,
  USER_CACHE_SERVICE,
} from 'src/auth/auth.constants';
import type {
  AuthJwtServiceInterface,
  JwtPayload,
} from 'src/auth/domain/interfaces/auth-jwt.service.interface';
import type { UserCacheServiceInterface } from 'src/auth/domain/interfaces/user-cache.service.interface';
import type { TokenCacheServiceInterface } from 'src/auth/domain/interfaces/token-cache.service.interface';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_JWT_SERVICE)
    private readonly jwtService: AuthJwtServiceInterface,
    @Inject(USER_CACHE_SERVICE)
    private readonly userCacheService: UserCacheServiceInterface,
    @Inject(TOKEN_CACHE_SERVICE)
    private readonly tokenCacheService: TokenCacheServiceInterface,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const token = this.extractBearerToken(request);

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verifyAccessToken(token);
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    const isBlocked = await this.tokenCacheService.isTokenBlacklisted(
      payload.jti,
    );
    if (isBlocked) {
      throw new UnauthorizedException('Invalid token');
    }
    const currentTokenVersion =
      await this.userCacheService.getTokenVersionByUserId(payload.id);
    if (currentTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractBearerToken(request: any): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    return token;
  }
}
