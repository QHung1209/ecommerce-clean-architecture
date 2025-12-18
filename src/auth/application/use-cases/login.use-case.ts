import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { UserRepositoryInterface } from 'src/user/domain/interfaces/user-repository.interface';
import { JwtService } from 'src/auth/infrastructure/jwt/jwt.service';
import type { RefreshTokenRepositoryInterface } from 'src/auth/domain/interfaces/refresh-token-repository.interface';
import type { BcryptPasswordHasher } from 'src/shared/infrastructure/security/bcrypt-password-hasher.service';
import { USER_REPOSITORY } from 'src/user/user.constants';
import { REFRESH_TOKEN_REPOSITORY } from 'src/auth/auth.constants';
import { PASSWORD_HASHER } from 'src/shared/shared.constants';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryInterface,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: BcryptPasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.getPassword(),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Check if user is active
    if (!user.isActive()) {
      throw new UnauthorizedException('User account is not active');
    }

    // 4. Generate tokens
    const accessToken = this.jwtService.generateAccessToken(
      user.id,
      user.getEmail(),
    );
    const refreshToken = this.jwtService.generateRefreshToken(user.id, user.getEmail());

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
