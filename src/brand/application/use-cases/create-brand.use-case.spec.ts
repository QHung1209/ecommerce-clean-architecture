import { CreateBrandUseCase } from './create-brand.use-case';
import { Brand } from 'src/brand/domain/entities/brand.entity';
import type { IBrandRepository } from 'src/brand/domain/interfaces/brand-repository.interface';

describe('CreateBrandUseCase', () => {
  let useCase: CreateBrandUseCase;
  let repo: jest.Mocked<IBrandRepository>;

  beforeEach(() => {
    repo = { save: jest.fn() } as any;
    useCase = new CreateBrandUseCase(repo);
  });

  it('should successfully create and save a new brand', async () => {
    repo.save.mockResolvedValue(Brand.create({ name: 'Nike' } as any, 1));
    const result = await useCase.execute({ name: 'Nike', logo: 'logo.png', description: '' }, 1);
    
    expect(repo.save).toHaveBeenCalled();
    expect(result.getId()).toBe(1);
    expect(result.getName()).toBe('Nike');
  });
});
