import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from 'src/auth/auth.constants';
import type { RefreshTokenRepositoryInterface } from 'src/auth/domain/interfaces/refresh-token-repository.interface';
import { JwtService } from 'src/auth/infrastructure/jwt/jwt.service';
import { BcryptPasswordHasher } from 'src/shared/infrastructure/security/bcrypt-password-hasher.service';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';
import { UserProps, UserStatus } from 'src/user/domain/entities/user.entity';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { USER_REPOSITORY } from 'src/user/user.constants';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: BcryptPasswordHasher,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
  ) {}

  async execute(data: { email: string; password: string }) {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(data.password);
    const userProps: UserProps = {
      email: data.email,
      password: hashedPassword,
      name: '',
      phoneNumber: '',
      status: UserStatus.ACTIVE,
      roleId: 1,
    };
    const user = await this.userRepository.create(userProps);
    const accessToken = this.jwtService.generateAccessToken(
      user.id,
      user.getEmail(),
    );
    const refreshToken = this.jwtService.generateRefreshToken(
      user.id,
      user.getEmail(),
    );

    // 5. Store refresh token
    const expiresAt = this.jwtService.getRefreshTokenExpiration();
    await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    // 6. Return result
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.getEmail(),
        name: user.getName(),
      },
    };
  }
}
