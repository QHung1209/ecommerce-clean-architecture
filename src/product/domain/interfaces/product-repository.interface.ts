import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Product } from '../entities/product.entity';
export interface IProductRepository extends IBaseRepository<Product, number> {
  save(entity: Product, id: number): Promise<Product>;
  findAllProducts(languageCode?: string): Promise<Product[]>;
  findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Product | null>;
  getProductDetail(id: number, languageCode?: string);
}
