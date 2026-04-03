import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  IAuthJwtService,
  JwtPayload,
} from 'src/auth/domain/interfaces/auth-jwt.service.interface';

@Injectable()
export class AuthJwtService implements IAuthJwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(
    userId: number,
    email: string,
    roleId: number,
    jti: string,
    tokenVersion: number,
  ): string {
    const payload = { id: userId, email, roleId, jti, tokenVersion };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(
    userId: number,
    email: string,
    roleId: number,
    jti: string,
    tokenVersion: number,
  ): string {
    const payload = { id: userId, email, roleId, jti, tokenVersion };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get(
        'JWT_REFRESH_EXPIRES_IN',
        15 * 24 * 60 * 60,
      ),
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token);
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }
}
