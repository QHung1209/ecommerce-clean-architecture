import { GetUserUseCase } from './get-user.use-case';
import { User } from 'src/user/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    } as any;
    useCase = new GetUserUseCase(mockUserRepository);
  });

  it('should return user if user exists', async () => {
    const user = User.create({ name: 'John' } as any);
    mockUserRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(1);
    expect(result).toBe(user);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
