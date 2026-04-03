import { GetProductUseCase } from './get-product.use-case';
import { Product } from 'src/product/domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import type { IProductRepository } from 'src/product/domain/interfaces/product-repository.interface';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let repo: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    repo = { getProductDetail: jest.fn(), findById: jest.fn() } as any;
    useCase = new GetProductUseCase(repo);
  });

  it('should return product details if found', async () => {
    repo.findById.mockResolvedValue({} as any);
    repo.getProductDetail.mockResolvedValue({ id: 1, name: 'Laptop' } as any);
    const result = await useCase.execute(1);
    expect(result.name).toBe('Laptop');
  });

  it('should throw Error if not found', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(useCase.execute(1)).rejects.toThrow(Error);
  });
});
