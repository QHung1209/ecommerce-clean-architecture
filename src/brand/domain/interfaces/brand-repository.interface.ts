import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Brand } from '../entities/brand.entity';

export interface IBrandRepository extends IBaseRepository<Brand, number> {
  save(entity: Brand, createdById: number): Promise<Brand>;
  findAllBrands(languageCode?: string): Promise<Brand[]>;
  findByCondition(condition: any, languageCode?: string): Promise<Brand | null>;
}
