import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import type { BcryptPasswordHasher } from 'src/shared/infrastructure/securities/bcrypt-password-hasher.service';
import { USER_REPOSITORY } from 'src/user/user.constants';
import {
  AUTH_JWT_SERVICE,
  PERMISSION_CACHE_SERVICE,
} from 'src/auth/auth.constants';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import { CreateDeviceUseCase } from 'src/device/application/use-cases/create-device.use-case';
import type { IPermissionCacheService } from 'src/auth/domain/interfaces/permission-cache.service.interface';
import type { IAuthJwtService } from 'src/auth/domain/interfaces/auth-jwt.service.interface';
import { v4 as uuidv4 } from 'uuid';

type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    roleId: number | null;
  };
};

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: BcryptPasswordHasher,
    @Inject(PERMISSION_CACHE_SERVICE)
    private readonly permissionCacheService: IPermissionCacheService,
    @Inject(AUTH_JWT_SERVICE)
    private readonly jwtService: IAuthJwtService,

    private readonly createDeviceUseCase: CreateDeviceUseCase,
  ) {}

  async execute(
    email: string,
    password: string,
    ip: string,
    userAgent: string,
  ): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Check your email and password again');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.getPassword(),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Check your email and password again');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('User account is not active');
    }

    const userId = user.getId();
    if (userId === undefined) {
      throw new Error('User ID is undefined');
    }
    user;
    const jti = uuidv4();
    const accessToken = this.jwtService.generateAccessToken(
      userId,
      user.getEmail().getValue(),
      user.getRoleId(),
      jti,
      user.getTokenVersion(),
    );
    const refreshToken = this.jwtService.generateRefreshToken(
      userId,
      user.getEmail().getValue(),
      user.getRoleId(),
      jti,
      user.getTokenVersion(),
    );

    await Promise.all([
      this.permissionCacheService.cachePermissionsByUser(
        userId,
        user.getRoleId(),
      ),
      this.createDeviceUseCase.execute({
        ip,
        userAgent,
        userId: userId,
        jti,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email: user.getEmail().getValue(),
        name: user.getName(),
        roleId: user.getRoleId() || null,
      },
    };
  }
}
