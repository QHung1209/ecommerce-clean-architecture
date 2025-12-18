import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../shared/infrastructure/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtService } from './infrastructure/jwt/jwt.service';
import { PrismaRefreshTokenRepository } from './infrastructure/repositories/prisma/prisma-refresh-token.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { BcryptPasswordHasher } from '../shared/infrastructure/security/bcrypt-password-hasher.service';
import { REFRESH_TOKEN_REPOSITORY } from './auth.constants';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import { RegisterUseCase } from './application/use-cases/register.use-case';

// Token for dependency injection

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('JWT_EXPIRES_IN', 900),
        },
      }),
    }),
    PrismaModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure
    JwtService,
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    // Application
    LoginUseCase,
    LogoutUseCase,
    RegisterUseCase,
    // Guards
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, JwtService],
})
export class AuthModule {}
