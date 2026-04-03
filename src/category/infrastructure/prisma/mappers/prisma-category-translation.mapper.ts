import {
  Prisma,
  CategoryTranslation as PrismaCategoryTranslation,
} from '@prisma/client';
import { CategoryTranslation } from 'src/category/domain/entities/category.translation.entity';

export class PrismaCategoryTranslationMapper {
  static toDomain(category: PrismaCategoryTranslation): any {
    const { id, ...rest } = category;
    return CategoryTranslation.create(rest, id);
  }

  static toPersistence(
    category: CategoryTranslation,
    id: number,
  ): Prisma.CategoryTranslationUncheckedCreateInput {
    return {
      id,
      name: category.getName(),
      description: category.getDescription(),
      slug: category.getSlug(),
      languageCode: category.getLanguageCode(),
      categoryId: category.getCategoryId(),
    };
  }
}
