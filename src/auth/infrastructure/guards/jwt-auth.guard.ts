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
  IAuthJwtService,
  JwtPayload,
} from 'src/auth/domain/interfaces/auth-jwt.service.interface';
import type { IUserCacheService } from 'src/auth/domain/interfaces/user-cache.service.interface';
import type { ITokenCacheService } from 'src/auth/domain/interfaces/token-cache.service.interface';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_JWT_SERVICE)
    private readonly jwtService: IAuthJwtService,
    @Inject(USER_CACHE_SERVICE)
    private readonly userCacheService: IUserCacheService,
    @Inject(TOKEN_CACHE_SERVICE)
    private readonly tokenCacheService: ITokenCacheService,
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

    // if (isRabbitContext(context)) {
    //   return true;
    // }

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
      throw new UnauthorizedException('Token is blocked');
    }
    const currentTokenVersion =
      await this.userCacheService.getTokenVersionByUserId(payload.id);
    if (currentTokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token is expired');
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
