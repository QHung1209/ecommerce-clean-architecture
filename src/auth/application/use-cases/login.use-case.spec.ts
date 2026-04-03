import { LoginUseCase } from './login.use-case';
import { User, UserStatus } from 'src/user/domain/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import type { IPasswordHasher } from 'src/shared/domain/interfaces/password-hasher.interface';
import type { IPermissionCacheService } from 'src/auth/domain/interfaces/permission-cache.service.interface';
import type { IAuthJwtService } from 'src/auth/domain/interfaces/auth-jwt.service.interface';
import { CreateDeviceUseCase } from 'src/device/application/use-cases/create-device.use-case';
import { Email } from 'src/shared/domain/value-objects/email.vo';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;
  let mockJwtService: jest.Mocked<IAuthJwtService>;

  beforeEach(() => {
    mockUserRepository = { findByEmail: jest.fn() } as any;
    mockPasswordHasher = { compare: jest.fn() } as any;
    mockJwtService = { generateAccessToken: jest.fn(), generateRefreshToken: jest.fn() } as any;
    const mockPermissionCache = { cachePermissionsByUser: jest.fn() } as any;
    const mockCreateDeviceUseCase = { execute: jest.fn() } as any;

    useCase = new LoginUseCase(
      mockUserRepository,
      mockPasswordHasher,
      mockPermissionCache,
      mockJwtService,
      mockCreateDeviceUseCase
    );
  });

  it('should authenticate successfully and return tokens', async () => {
    const user = User.create({ email: Email.create('test@example.com'), status: UserStatus.ACTIVE, roleId: 1, password: 'hashed' } as any, 1);
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);
    mockJwtService.generateAccessToken.mockReturnValue('access');
    mockJwtService.generateRefreshToken.mockReturnValue('refresh');

    const result = await useCase.execute('test@example.com', 'password', '127.0.0.1', 'Chrome');
    
    expect(result.accessToken).toBe('access');
    expect(mockJwtService.generateAccessToken).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException on wrong email', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    await expect(useCase.execute('none@example.com', 'pwd', '', '')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    const user = User.create({ status: UserStatus.ACTIVE } as any, 1);
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute('test@example.com', 'wrong', '', '')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user is INACTIVE', async () => {
    const user = new User({ status: UserStatus.INACTIVE } as any, 1);
    mockUserRepository.findByEmail.mockResolvedValue(user);

    await expect(useCase.execute('test@example.com', 'pwd', '', '')).rejects.toThrow(UnauthorizedException);
  });
});
