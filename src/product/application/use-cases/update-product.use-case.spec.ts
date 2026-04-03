import { UpdateProductUseCase } from './update-product.use-case';
import { Product } from 'src/product/domain/entities/product.entity';
import type { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockUow: jest.Mocked<IUnitOfWork>;
  let mockUowCtx: any;

  beforeEach(() => {
    mockUowCtx = {
      getProductRepository: jest
        .fn()
        .mockReturnValue({ save: jest.fn(), findById: jest.fn() }),
      getVariantRepository: jest.fn().mockReturnValue({
        save: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      }),
      getVariantOptionRepository: jest.fn().mockReturnValue({
        save: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      }),
      getSkuRepository: jest.fn().mockReturnValue({
        save: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      }),
    } as any;

    mockUow = {
      runInTransaction: jest.fn().mockImplementation(async (callback) => {
        return await callback(mockUowCtx);
      }),
    } as any;

    useCase = new UpdateProductUseCase(mockUow);
  });

  const command = {
    name: 'Laptop updated',
    description: '',
    basePrice: 1000,
    virtualPrice: 0,
    brandId: 1,
    images: [],
    categoryIds: [],
    variants: [],
    skus: [],
  };

  it('should throw error if product not found', async () => {
    mockUowCtx.getProductRepository().findById.mockResolvedValue(null);

    await expect(useCase.execute(1, command, 1)).rejects.toThrow(
      'Product not found',
    );
  });

  it('should perform update if product exists', async () => {
    mockUowCtx
      .getProductRepository()
      .findById.mockResolvedValue(Product.create({} as any, 1));
    mockUowCtx.getVariantRepository().findMany.mockResolvedValue([]);
    mockUowCtx.getVariantOptionRepository().findMany.mockResolvedValue([]);
    mockUowCtx.getSkuRepository().findMany.mockResolvedValue([]);

    const result = await useCase.execute(1, command, 1);

    expect(mockUowCtx.getProductRepository().save).toHaveBeenCalled();
    expect(result.message).toBe('Product updated successfully');
  });
});
