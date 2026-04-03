import { UpdateUserUseCase } from './update-user.use-case';
import { User, UserStatus } from 'src/user/domain/entities/user.entity';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
      findByPhoneNumber: jest.fn(),
    } as any;
    useCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update user successfully', async () => {
    const user = new User({ status: UserStatus.ACTIVE } as any);
    mockUserRepository.findById.mockResolvedValue(user);
    mockUserRepository.save.mockResolvedValue(user);

    await useCase.execute(1, { name: 'New Name', email: 'valid@example.com', phoneNumber: '123456789', avatar: '', roleId: 2 });
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, { name: '', email: 'valid@example.com', phoneNumber: '', avatar: '', roleId: 2 })).rejects.toThrow(NotFoundException);
  });
});
