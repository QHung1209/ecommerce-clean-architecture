import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Variant } from '../entities/variant.entity';

export interface IVariantRepository extends IBaseRepository<Variant, number> {
  save(entity: Variant, id: number): Promise<Variant>;
  findAllVariants(languageCode?: string): Promise<Variant[]>;
  findByCondition(
    condition: any,
    languageCode?: string,
  ): Promise<Variant | null>;
  findMany(conditions: any): Promise<Variant[]>;
  deleteMany(ids: number[], deletedById: number): Promise<void>;
}
