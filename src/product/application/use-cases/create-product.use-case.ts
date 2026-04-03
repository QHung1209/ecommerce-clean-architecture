import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/product/domain/entities/product.entity';
import { Sku } from 'src/product/domain/entities/sku.entity';
import { VariantOption } from 'src/product/domain/entities/variant-option.entity';
import { Variant } from 'src/product/domain/entities/variant.entity';
import { ProductDomainService } from 'src/product/domain/services/product-domain.service';
import type { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK } from 'src/shared/shared.constants';

type CreateProductCommand = {
  name: string;
  description: string;
  basePrice: number;
  virtualPrice: number;
  brandId: number;
  images: string[];
  categoryIds: number[];
  variants: {
    name: string;
    options: string[];
  }[];
  skus: {
    value: string;
    price: number;
    stock: number;
    images: string[];
    options: {
      name: string;
      value: string;
    }[];
  }[];
};

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}
  async execute(product: CreateProductCommand, createdById: number) {
    return this.uow.runInTransaction(async (uowCtx) => {
      const productEntity = Product.create({
        name: product.name,
        basePrice: product.basePrice,
        virtualPrice: product.virtualPrice,
        description: product.description,
        brandId: product.brandId,
        images: product.images,
        categoryIds: product.categoryIds,
      });
      const savedProduct = await uowCtx
        .getProductRepository()
        .save(productEntity, createdById);

      const variantEntities = product.variants.map((variant) =>
        Variant.create({
          name: variant.name,
          productId: savedProduct.getId()!,
        }),
      );
      const savedVariants = await Promise.all(
        variantEntities.map((variant) =>
          uowCtx.getVariantRepository().save(variant, createdById),
        ),
      );
      const variantsMap = new Map<string, Variant>();
      savedVariants.forEach((variant) => {
        variantsMap.set(variant.getName(), variant);
      });

      const variantOptionEntities = product.variants.flatMap((variant) => {
        return variant.options.map((option) =>
          VariantOption.create({
            value: option,
            variantId: variantsMap.get(variant.name)?.getId()!,
          }),
        );
      });
      await Promise.all(
        variantOptionEntities.map((variantOption) =>
          uowCtx.getVariantOptionRepository().save(variantOption, createdById),
        ),
      );

      const skuEntities = product.skus.map((sku) =>
        Sku.create({
          value: sku.value,
          price: sku.price,
          stock: sku.stock,
          images: sku.images,
          variantOptionIds: ProductDomainService.resolveSkuVariantOptionIds(
            sku.options,
            variantsMap,
            variantOptionEntities,
          ),
          productId: savedProduct.getId()!,
        }),
      );
      await Promise.all(
        skuEntities.map((sku) =>
          uowCtx.getSkuRepository().save(sku, createdById),
        ),
      );
      return 201;
    });
  }
}
