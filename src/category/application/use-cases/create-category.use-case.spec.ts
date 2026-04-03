import { CreateCategoryUseCase } from './create-category.use-case';
import { Category } from 'src/category/domain/entities/category.entity';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repo: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    repo = { save: jest.fn() } as any;
    useCase = new CreateCategoryUseCase(repo);
  });

  it('should successfully create and save a new category', async () => {
    repo.findByCondition = jest.fn().mockResolvedValue(null);
    repo.save.mockResolvedValue(Category.create({ name: 'Tech' } as any, 1));
    const result = await useCase.execute(
      {
        name: 'Tech',
        logo: 'logo.png',
        description: '',
        slug: 'tech',
        parentCategoryId: 0,
      },
      1,
    );

    expect(repo.save).toHaveBeenCalled();
    expect(result.getId()).toBe(1);
    expect(result.getName()).toBe('Tech');
  });
});
