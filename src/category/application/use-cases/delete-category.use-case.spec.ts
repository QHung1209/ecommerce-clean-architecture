import { DeleteCategoryUseCase } from './delete-category.use-case';
import { Category } from 'src/category/domain/entities/category.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let mockCategoryRepo: jest.Mocked<ICategoryRepository>;
  let mockCategoryTransRepo: jest.Mocked<ICategoryTranslationRepository>;

  beforeEach(() => {
    mockCategoryRepo = {
      findById: jest.fn(),
      getCategoriesByParentCategoryId: jest.fn(),
      delete: jest.fn(),
    } as any;
    mockCategoryTransRepo = {
      deleteByCategoryId: jest.fn(),
    } as any;

    useCase = new DeleteCategoryUseCase(mockCategoryRepo, mockCategoryTransRepo);
  });

  it('should delete category and translations if no children exist', async () => {
    const category = Category.create({ name: 'Test' } as any);
    mockCategoryRepo.findById.mockResolvedValue(category);
    mockCategoryRepo.getCategoriesByParentCategoryId.mockResolvedValue([]); // No children

    await useCase.execute(1, 2);

    expect(mockCategoryTransRepo.deleteByCategoryId).toHaveBeenCalledWith(1, 2);
    expect(mockCategoryRepo.delete).toHaveBeenCalledWith(1, 2);
  });

  it('should throw NotFoundException if category not found', async () => {
    mockCategoryRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1, 2)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if category has children', async () => {
    const category = Category.create({ name: 'Test' } as any);
    mockCategoryRepo.findById.mockResolvedValue(category);
    // Simulate finding a child
    mockCategoryRepo.getCategoriesByParentCategoryId.mockResolvedValue([{ id: 2 }] as any);

    // ensureCanDelete domain method throws Error, Use Case catches and wraps in BadRequestException
    await expect(useCase.execute(1, 2)).rejects.toThrow(BadRequestException);
    expect(mockCategoryRepo.delete).not.toHaveBeenCalled();
  });
});
