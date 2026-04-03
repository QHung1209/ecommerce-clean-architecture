import { VariantOption } from 'src/product/domain/entities/variant-option.entity';
import { Variant } from 'src/product/domain/entities/variant.entity';
import { PrismaVariantMapper } from './prisma-variant.mapper';

export class PrismaVariantOptionMapper {
  static toDomain(variantOption: any): VariantOption {
    return VariantOption.create(
      {
        value: variantOption.value,
        variantId: variantOption.variantId,
      },
      variantOption.id,
    );
  }

  static toDomainWithOption(variantOption: any): VariantOption {
    return VariantOption.create(
      {
        value: variantOption.value,
        variantId: variantOption.variantId,
        variant: PrismaVariantMapper.toDomain(variantOption.variant),
      },
      variantOption.id,
    );
  }
}
