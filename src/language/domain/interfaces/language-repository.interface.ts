import { IBaseRepository } from 'src/shared/domain/interfaces/base-repository.interface';
import { Language } from '../entities/language.entity';

export interface ILanguageRepository extends IBaseRepository<Language, number> {
  save(language: Language, createdById?: number): Promise<Language>;
  findByCode(code: string): Promise<Language | null>;
}
