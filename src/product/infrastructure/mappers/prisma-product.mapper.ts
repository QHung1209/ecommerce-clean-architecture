import { Product } from 'src/product/domain/entities/product.entity';

import { Prisma } from '@prisma/client';
import { PrismaBrandMapper } from 'src/brand/infrastructure/prisma/mappers/prisma-brand.mapper';
import { PrismaCategoryMapper } from 'src/category/infrastructure/prisma/mappers/prisma-category.mapper';

export type PrismaProductDetailEntity = Prisma.ProductGetPayload<{
  include: {
    productTranslations: true;
    categories: true;
    brand: true;
  };
}>;

export class PrismaProductMapper {
  static toDomain(product: any): Product {
    const translation = product.productTranslations?.[0];
    return Product.create(
      {
        name: translation?.name ?? product.name,
        basePrice: product.basePrice,
        virtualPrice: product.virtualPrice,
        description: translation?.description ?? product.description,
        brandId: product.brandId,
        images: product.images,
        categoryIds: product.categories.map((category) => category.id),
      },
      product.id,
    );
  }

  static toDomainWithOptions(product: PrismaProductDetailEntity) {
    const translation = product.productTranslations?.[0];
    return {
      name: translation?.name ?? product.name,
      basePrice: product.basePrice,
      virtualPrice: product.virtualPrice,
      brandId: product.brandId,
      description: translation?.description ?? product.description,
      brand: product.brand
        ? PrismaBrandMapper.toDomain(product.brand)
        : undefined,
      images: product.images,
      categoryIds: product.categories.map((category) => category.id),
      categories:
        product.categories && product.categories.length > 0
          ? product.categories.map((category) =>
              PrismaCategoryMapper.toDomain(category),
            )
          : undefined,
    };
  }

  static toPersistence(
    product: Product,
    id: number,
  ): Prisma.ProductUncheckedCreateInput {
    return {
      id,
      name: product.getName(),
      basePrice: product.getBasePrice(),
      virtualPrice: product.getVirtualPrice(),
      brandId: product.getBrandId(),
      images: product.getImages(),
      description: product.getDescription(),
      categories: {
        connect: product.getCategoryIds().map((id) => ({
          id,
        })),
      },
      createdById: id,
    };
  }
}
