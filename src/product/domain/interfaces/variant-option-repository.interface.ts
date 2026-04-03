import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { VariantOption } from '../entities/variant-option.entity';

export interface IVariantOptionRepository extends IBaseRepository<
  VariantOption,
  number
> {
  save(entity: VariantOption, id: number): Promise<VariantOption>;
  findAllVariantOptions(languageCode?: string): Promise<VariantOption[]>;
  findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<VariantOption | null>;
  findMany(conditions: any): Promise<VariantOption[] | []>;
  deleteMany(ids: number[], deletedById: number): Promise<void>;
}
