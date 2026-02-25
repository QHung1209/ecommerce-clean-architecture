import { Language } from 'src/language/domain/entities/language.entity';
import { Prisma, Language as PrismaLanguage } from '@prisma/client';

export class PrismaLanguageMapper {
  static toDomain(language: PrismaLanguage): Language {
    const { id, ...rest } = language;
    return Language.create(rest, id);
  }

  static toCreatePersistence(
    language: Language,
    id?: number,
  ): Prisma.LanguageUncheckedCreateInput {
    return {
      id,
      name: language.getName(),
      code: language.getCode(),
    };
  }

  static toUpdatePersistence(
    language: Language,
    id?: number,
  ): Prisma.LanguageUncheckedUpdateInput {
    return {
      id,
      name: language.getName(),
      code: language.getCode(),
    };
  }
}
