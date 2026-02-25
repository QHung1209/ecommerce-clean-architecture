import { Prisma } from '@prisma/client';
import { Brand } from 'src/brand/domain/entities/brand.entity';

export class PrismaBrandMapper {
  static toDomain(brand: any): Brand {
    const translation = brand.brandTranslations?.[0];

    return new Brand(
      {
        logo: brand.logo,
        name: translation?.name ?? brand.name,
        description: translation?.description ?? brand.description,
      },
      brand.id,
    );
  }

  static toPersistence(
    brand: Brand,
    id: number,
  ): Prisma.BrandUncheckedCreateInput {
    return {
      id,
      logo: brand.getLogo(),
      name: brand.getName(),
      description: brand.getDescription(),
    };
  }
}
