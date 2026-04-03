import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Sku } from '../entities/sku.entity';

export interface ISkuRepository extends IBaseRepository<Sku, number> {
  save(entity: Sku, id: number): Promise<Sku>;
  findAllSkus(languageCode?: string): Promise<Sku[]>;
  findByCondition(condition: any, languageCode?: string): Promise<Sku | null>;
  findMany(conditions: any): Promise<Sku[]>;
  deleteMany(ids: number[], deletedById: number): Promise<void>;
}
