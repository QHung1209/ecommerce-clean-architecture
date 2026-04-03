import { Variant } from 'src/product/domain/entities/variant.entity';
import { Variant as PrismaVariant, Prisma } from '@prisma/client';
import { PrismaVariantOptionMapper } from './prisma-variant-option.mapper';
export type PrismaVariantDetailEntity = Prisma.VariantGetPayload<{
  include: {
    variantOptions: true;
  };
}>;
export class PrismaVariantMapper {
  static toDomain(variant: PrismaVariant): Variant {
    return Variant.create(
      {
        name: variant.name,
        productId: variant.productId,
      },
      variant.id,
    );
  }
  static toDomainWithOption(variant: PrismaVariantDetailEntity): Variant {
    return Variant.create(
      {
        name: variant.name,
        productId: variant.productId,
        variantOptions: variant.variantOptions.map((option) =>
          PrismaVariantOptionMapper.toDomain(option),
        ),
      },
      variant.id,
    );
  }
}
