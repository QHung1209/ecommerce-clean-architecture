import { IProductRepository } from 'src/product/domain/interfaces/product-repository.interface';
import { ISkuRepository } from 'src/product/domain/interfaces/sku-repository.interface';
import { IVariantRepository } from 'src/product/domain/interfaces/variant-repository.interface';
import { IVariantOptionRepository } from 'src/product/domain/interfaces/variant-option-repository.interface';

export interface IUnitOfWork {
  runInTransaction<T>(work: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
  getProductRepository(): IProductRepository;
  getSkuRepository(): ISkuRepository;
  getVariantRepository(): IVariantRepository;
  getVariantOptionRepository(): IVariantOptionRepository;
}
