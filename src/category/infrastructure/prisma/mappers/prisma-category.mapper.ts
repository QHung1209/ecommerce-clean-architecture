import { Prisma } from '@prisma/client';
import { Category } from 'src/category/domain/entities/category.entity';

export class PrismaCategoryMapper {
  static toDomain(category: any): Category {
    const translation = category.categoryTranslations?.[0];

    return new Category(
      {
        name: translation?.name ?? category.name,
        slug: translation?.slug ?? category.slug,
        description: translation?.description ?? category.description,
        logo: category.logo,
        parentCategoryId: category.parentCategoryId,
      },
      category.id,
    );
  }

  static toPersistence(
    category: Category,
    id: number,
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      id,
      parentCategoryId: category.getParentCategoryId(),
      name: category.getName(),
      description: category.getDescription(),
      slug: category.getSlug(),
      logo: category.getLogo(),
    };
  }
}
