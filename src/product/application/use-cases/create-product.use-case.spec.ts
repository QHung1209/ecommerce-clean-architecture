import { CreateProductUseCase } from './create-product.use-case';
import { Product } from 'src/product/domain/entities/product.entity';
import type { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockUow: jest.Mocked<IUnitOfWork>;
  let mockUowCtx: any;

  beforeEach(() => {
    mockUowCtx = {
      getProductRepository: jest.fn().mockReturnValue({ save: jest.fn() }),
      getVariantRepository: jest.fn().mockReturnValue({ save: jest.fn() }),
      getVariantOptionRepository: jest
        .fn()
        .mockReturnValue({ save: jest.fn() }),
      getSkuRepository: jest.fn().mockReturnValue({ save: jest.fn() }),
    } as any;

    mockUow = {
      runInTransaction: jest.fn().mockImplementation(async (callback) => {
        return await callback(mockUowCtx);
      }),
    } as any;

    useCase = new CreateProductUseCase(mockUow);
  });

  const command = {
    name: 'Laptop',
    description: 'Gaming',
    basePrice: 1000,
    virtualPrice: 1500,
    brandId: 1,
    images: [],
    categoryIds: [],
    variants: [{ name: 'Color', options: ['Red', 'Blue'] }],
    skus: [
      {
        value: 'SKU1',
        price: 1000,
        stock: 10,
        images: [],
        options: [{ name: 'Color', value: 'Red' }],
      },
    ],
  };

  it('should create product, variants, options, and SKUs inside a transaction', async () => {
    const productRepo = mockUowCtx.getProductRepository();
    const variantRepo = mockUowCtx.getVariantRepository();

    productRepo.save.mockResolvedValue(
      Product.create({ name: 'Laptop' } as any, 1),
    );
    variantRepo.save.mockResolvedValue({
      getId: () => 10,
      getName: () => 'Color',
    } as any);
    mockUowCtx
      .getVariantOptionRepository()
      .save.mockResolvedValue({ getId: () => 100 } as any);
    mockUowCtx
      .getSkuRepository()
      .save.mockResolvedValue({ getId: () => 1000 } as any);

    const result = await useCase.execute(command, 1);

    expect(mockUow.runInTransaction).toHaveBeenCalled();
    expect(productRepo.save).toHaveBeenCalled();
    expect(variantRepo.save).toHaveBeenCalled();
    expect(mockUowCtx.getVariantOptionRepository().save).toHaveBeenCalledTimes(
      2,
    ); // Red, Blue
    expect(mockUowCtx.getSkuRepository().save).toHaveBeenCalledTimes(1); // 1 SKU
    expect(result).toBe(201);
  });
});
