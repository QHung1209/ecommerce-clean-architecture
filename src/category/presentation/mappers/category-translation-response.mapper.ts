import { CategoryTranslation } from 'src/category/domain/entities/category.translation.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

export class CategoryTranslationResponseMapper {
  static toResponse(categoryTranslation: CategoryTranslation): any {
    return {
      id: categoryTranslation.getId(),
      name: categoryTranslation.getName(),
      description: categoryTranslation.getDescription(),
      slug: categoryTranslation.getSlug(),
      languageCode: categoryTranslation.getLanguageCode(),
      categoryId: categoryTranslation.getCategoryId(),
    };
  }

  static toResponseList(categoryTranslations: CategoryTranslation[]): any {
    return categoryTranslations.map((categoryTranslation) =>
      this.toResponse(categoryTranslation),
    );
  }

  static toPaginatedResponse(
    categoryTranslations: PaginatedResult<CategoryTranslation>,
  ): any {
    return {
      categoryTranslations: this.toResponseList(categoryTranslations.data),
      total: categoryTranslations.total,
      totalPages: categoryTranslations.totalPages,
      currentPage: categoryTranslations.currentPage,
    };
  }
}
