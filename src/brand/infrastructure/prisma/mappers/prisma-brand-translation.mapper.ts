import {
  Prisma,
  BrandTranslation as PrismaBrandTranslation,
} from '@prisma/client';
import { BrandTranslation } from 'src/brand/domain/entities/brand.translation.entity';

export class PrismaBrandTranslationMapper {
  static toDomain(brandTranslation: PrismaBrandTranslation): BrandTranslation {
    const { id, ...rest } = brandTranslation;
    return BrandTranslation.create(rest as any, id);
  }

  static toPersistence(
    brandTranslation: BrandTranslation,
    id: number,
  ): Prisma.BrandTranslationUncheckedCreateInput {
    return {
      id,
      name: brandTranslation.getName(),
      description: brandTranslation.getDescription(),
      languageCode: brandTranslation.getLanguageCode(),
      brandId: brandTranslation.getBrandId(),
    };
  }
}
