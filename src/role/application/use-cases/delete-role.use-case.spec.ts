import { DeleteRoleUseCase } from './delete-role.use-case';
import { Role } from 'src/role/domain/entities/role.entity';
import { User } from 'src/user/domain/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from 'src/role/domain/interfaces/role-repository.interface';
import type { IUserRepository } from 'src/user/domain/interfaces/user-repository.interface';

describe('DeleteRoleUseCase', () => {
  let useCase: DeleteRoleUseCase;
  let mockRoleRepo: jest.Mocked<IRoleRepository>;
  let mockUserRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRoleRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;
    mockUserRepo = {
      findAll: jest.fn(),
      save: jest.fn(),
      findByRoleId: jest.fn(),
    } as any;

    useCase = new DeleteRoleUseCase(mockRoleRepo, mockUserRepo);
  });

  it('should delete role and detach role from existing users', async () => {
    mockRoleRepo.findById.mockResolvedValue(Role.create({ name: 'Manager' } as any, 1));
    const user = User.create({ name: 'Admin', roleId: 1 } as any);
    mockUserRepo.findByRoleId.mockResolvedValue([user]);

    await useCase.execute(1);

    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      getRoleId: expect.any(Function)
    }));
    expect(user.getRoleId()).toBeNull();
    expect(mockRoleRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if role not found', async () => {
    mockRoleRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
