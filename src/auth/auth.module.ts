import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../shared/infrastructure/databases/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthJwtService } from './infrastructure/jwt/jwt.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { BcryptPasswordHasher } from '../shared/infrastructure/securities/bcrypt-password-hasher.service';
import {
  AUTH_JWT_SERVICE,
  PERMISSION_CACHE_SERVICE,
  REFRESH_TOKEN_REPOSITORY,
  RESET_PASSWORD_TOKEN_CACHE_SERVICE,
  TOKEN_CACHE_SERVICE,
  USER_CACHE_SERVICE,
} from './auth.constants';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { DeviceModule } from 'src/device/device.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionModule } from 'src/permission/permission.module';
import { PermissionCacheService } from './infrastructure/cache/permission-cache.service';
import { UserCacheService } from './infrastructure/cache/user-cache.service';
import { RoleModule } from 'src/role/role.module';
import { PermissionGuard } from './infrastructure/guards/permission.guard';
import { TokenCacheService } from './infrastructure/cache/token-cache.service';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { ForgorPasswordUseCase } from './application/use-cases/forgot-password.use-case';
import { VerifyResetPasswordOtpUseCase } from './application/use-cases/verify-reset-password-otp.use-case';
import { ResetPasswordTokenCacheService } from './infrastructure/cache/reset-passowrd-token-cache.service';
import { ResetPasswordUseCase } from './application/use-cases/reset-pasword.use-case';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', 900),
        },
      }),
    }),
    PrismaModule,
    UserModule,
    PermissionModule,
    RoleModule,
    DeviceModule,
    VerificationCodeModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_JWT_SERVICE,
      useClass: AuthJwtService,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: USER_CACHE_SERVICE,
      useClass: UserCacheService,
    },
    {
      provide: PERMISSION_CACHE_SERVICE,
      useClass: PermissionCacheService,
    },
    {
      provide: TOKEN_CACHE_SERVICE,
      useClass: TokenCacheService,
    },
    {
      provide: RESET_PASSWORD_TOKEN_CACHE_SERVICE,
      useClass: ResetPasswordTokenCacheService
    },
    LoginUseCase,
    LogoutUseCase,
    RegisterUseCase,
    ForgorPasswordUseCase,
    VerifyResetPasswordOtpUseCase,
    ResetPasswordUseCase,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [
    AUTH_JWT_SERVICE,
    USER_CACHE_SERVICE,
    PERMISSION_CACHE_SERVICE,
    TOKEN_CACHE_SERVICE,
    PASSWORD_HASHER,
    RESET_PASSWORD_TOKEN_CACHE_SERVICE,
  ],
})
export class AuthModule {}
