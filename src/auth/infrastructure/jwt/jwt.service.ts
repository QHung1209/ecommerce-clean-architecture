import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  AuthJwtServiceInterface,
  JwtPayload,
} from 'src/auth/domain/interfaces/auth-jwt.service.interface';

@Injectable()
export class AuthJwtService implements AuthJwtServiceInterface {
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
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
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
    const accessToken = this.extractToken(token);
    return this.jwtService.verify<JwtPayload>(accessToken, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  verifyRefreshToken(token: string) {
    const refreshToken = this.extractToken(token);
    return this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  private extractToken(token: string) {
    if (token.startsWith('Bearer ')) {
      return token.split('Bearer ')[1];
    }
    return token;
  }
}
