import { Injectable } from '@nestjs/common';
import { RefreshTokenRepositoryInterface } from 'src/auth/domain/interfaces/refresh-token-repository.interface';
import { PrismaService } from 'src/shared/infrastructure/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, token: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findByToken(
    token: string,
  ): Promise<{ userId: number; expiresAt: Date } | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    });

    return refreshToken;
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.refreshToken
      .delete({
        where: { token },
      })
      .catch(() => {
        // Token might not exist, ignore error
      });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
