import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { BrandTranslation } from '../entities/brand.translation.entity';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

export interface IBrandTranslationRepository extends IBaseRepository<
  BrandTranslation,
  number
> {
  save(
    entity: BrandTranslation,
    createdById: number,
  ): Promise<BrandTranslation>;

  findByBrandId(
    brandId: number,
    query: ISharedQuery,
  ): Promise<BrandTranslation[]>;
  deleteByBrandId(brandId: number, updatedById: number): Promise<void>;
  countByBrandId(brandId: number): Promise<number>;
}
