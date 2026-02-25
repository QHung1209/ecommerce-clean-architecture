import { BrandTranslation } from 'src/brand/domain/entities/brand.translation.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

export class BrandTranslationResponseMapper {
  static toResponse(brandTranslation: BrandTranslation): any {
    return {
      id: brandTranslation.getId(),
      name: brandTranslation.getName(),
      description: brandTranslation.getDescription(),
      languageCode: brandTranslation.getLanguageCode(),
      brandId: brandTranslation.getBrandId(),
      logo: brandTranslation.getLogo(),
    };
  }

  static toResponseList(brandTranslations: BrandTranslation[]): any {
    return brandTranslations.map((bt) => this.toResponse(bt));
  }

  static toPaginatedResponse(
    brandTranslations: PaginatedResult<BrandTranslation>,
  ): any {
    return {
      data: this.toResponseList(brandTranslations.data),
      meta: {
        total: brandTranslations.total,
        totalPages: brandTranslations.totalPages,
        currentPage: brandTranslations.currentPage,
      },
    };
  }
}
