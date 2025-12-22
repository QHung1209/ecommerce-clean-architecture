import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  id: number; // user id
  email: string;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: number, email: string): string {
    const payload: JwtPayload = { id: userId, email };
    // Don't override secret - use module configuration
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userId: number, email: string): string {
    const payload: JwtPayload = { id: userId, email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', 9000),
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  getRefreshTokenExpiration(): Date {
    const expiresInMs = Number(
      this.configService.get('JWT_REFRESH_EXPIRES_IN', 7 * 24 * 60 * 60),
    );

    const date = new Date(Date.now() + expiresInMs);
    return date;
  }
}
