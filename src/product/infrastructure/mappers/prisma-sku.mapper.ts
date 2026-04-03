import { Sku } from 'src/product/domain/entities/sku.entity';
import { PrismaVariantOptionMapper } from './prisma-variant-option.mapper';
import { VariantOption } from 'src/product/domain/entities/variant-option.entity';

export class PrismaSkuMapper {
  static toDomain(sku: any): Sku {
    return Sku.create(
      {
        value: sku.value,
        productId: sku.productId,
        price: sku.price,
        stock: sku.stock,
        images: sku.images,
        variantOptionIds: sku.variantOptionIds,
      },
      sku.id,
    );
  }

  static toDomainWithOption(sku: any): Sku {
    return Sku.create(
      {
        value: sku.value,
        productId: sku.productId,
        price: sku.price,
        stock: sku.stock,
        images: sku.images,
        variantOptionIds: sku.variantOptionIds,
        variantOptions: sku.variantOptions.map((option) =>
          PrismaVariantOptionMapper.toDomainWithOption(option),
        ),
      },
      sku.id,
    );
  }
}
