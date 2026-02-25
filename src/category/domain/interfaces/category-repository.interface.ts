import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Category } from '../entities/category.entity';

export interface ICategoryRepository extends IBaseRepository<Category, number> {
  save(entity: Category, createdById: number): Promise<Category>;
  getCategoriesByParentCategoryId(
    parentCategoryId: number,
    languageCode?: string,
  ): Promise<Category[] | []>;
  findAllCategories({
    parentCategoryId,
    languageCode,
  }: {
    parentCategoryId?: number;
    languageCode?: string;
  }): Promise<Category[] | []>;
  findByCondition(condition: any, languageCode?: string): Promise<Category | null>;
}
