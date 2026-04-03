import { RegisterUseCase } from './register.use-case';
import { User } from 'src/user/domain/entities/user.entity';
import { ConflictException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';
import type { IPasswordHasher } from 'src/shared/domain/interfaces/password-hasher.interface';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let repo: jest.Mocked<IUserRepository>;
  let hasher: jest.Mocked<IPasswordHasher>;
  let jwt: any;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as any;
    hasher = { hash: jest.fn() } as any;
    jwt = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
    } as any;

    useCase = new RegisterUseCase(hasher, repo, jwt);
  });

  const command = {
    name: 'Test',
    email: 'test@example.com',
    password: 'Password123!',
  };

  it('should hash password and save user', async () => {
    repo.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed_password');
    repo.save.mockResolvedValue({
      getId: () => 1,
      getEmail: () => ({ getValue: () => 'test' }),
      getRoleId: () => 1,
      getTokenVersion: () => 1,
      getName: () => 'Test',
    } as any);

    await useCase.execute(command);

    // Ensure it was called correctly
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw Error if email exists', async () => {
    repo.findByEmail.mockResolvedValue({} as User); // Found existing
    await expect(useCase.execute(command)).rejects.toThrow(Error);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
