import { CreateUserUseCase } from './create-user.use-case';
import { User, UserStatus } from 'src/user/domain/entities/user.entity';
import { ConflictException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as any;
    useCase = new CreateUserUseCase(mockUserRepository);
  });

  const command = {
    name: 'John Test',
    email: 'test@example.com',
    password: 'Password123!',
    phoneNumber: '0123456789',
    roleId: 2,
    avatar: 'avatar.png',
  };

  it('should successfully create and save a new user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockImplementation(async (user) => {
      return new User({ ...user.getProps() }, 1);
    });

    const result = await useCase.execute(command);

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(User);
    expect(result.getId()).toBe(1);
    expect(result.getName()).toBe(command.name);
  });

  it('should throw Error if email is already in use', async () => {
    mockUserRepository.findByEmail.mockResolvedValue({} as any);

    await expect(useCase.execute(command)).rejects.toThrow();
  });
});
