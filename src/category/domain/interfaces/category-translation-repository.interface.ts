import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { CategoryTranslation } from '../entities/category.translation.entity';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

export interface ICategoryTranslationRepository extends IBaseRepository<
  CategoryTranslation,
  number
> {
  save(
    entity: CategoryTranslation,
    createdById: number,
  ): Promise<CategoryTranslation>;

  findByCategoryId(
    categoryId: number,
    query: ISharedQuery,
  ): Promise<CategoryTranslation[]>;
  deleteByCategoryId(categoryId: number, updatedById: number): Promise<void>;
  countByCategoryId(categoryId: number): Promise<number>;
}
