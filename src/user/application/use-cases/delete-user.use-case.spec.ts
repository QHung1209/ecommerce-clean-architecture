import { DeleteUserUseCase } from './delete-user.use-case';
import { User, UserStatus } from 'src/user/domain/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    useCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should delete user if user is found to be active and not self-deleting', async () => {
    const user = User.create({ status: UserStatus.ACTIVE } as any);
    mockUserRepository.findById.mockResolvedValue(user);

    await useCase.execute(1, 2); // delete user 1 by user 2
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1, 2);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, 2)).rejects.toThrow(NotFoundException);
  });
});
