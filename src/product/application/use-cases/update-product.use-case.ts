import { Inject, Injectable } from '@nestjs/common';
import { Sku } from 'src/product/domain/entities/sku.entity';
import { VariantOption } from 'src/product/domain/entities/variant-option.entity';
import { Variant } from 'src/product/domain/entities/variant.entity';
import { ProductDomainService } from 'src/product/domain/services/product-domain.service';
import type { IUnitOfWork } from 'src/shared/domain/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK } from 'src/shared/shared.constants';

type UpdateSkuCommand = {
  id?: number;
  value: string;
  price: number;
  stock: number;
  images: string[];
  options: {
    name: string;
    value: string;
  }[];
};

type UpdateVariantCommand = {
  id?: number;
  name: string;
  options: string[];
};

type UpdateProductCommand = {
  name: string;
  description: string;
  basePrice: number;
  virtualPrice: number;
  brandId: number;
  images: string[];
  categoryIds: number[];
  variants: UpdateVariantCommand[];
  skus: UpdateSkuCommand[];
};

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(UNIT_OF_WORK)
    private readonly uow: IUnitOfWork,
  ) {}

  async execute(id: number, data: UpdateProductCommand, updatedById: number) {
    return this.uow.runInTransaction(async (uowCtx) => {
      // 1. Find and update product
      const productEntity = await uowCtx.getProductRepository().findById(id);
      if (!productEntity) {
        throw new Error('Product not found');
      }
      productEntity.update({
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        virtualPrice: data.virtualPrice,
        brandId: data.brandId,
        images: data.images,
        categoryIds: data.categoryIds,
      });
      await uowCtx.getProductRepository().save(productEntity, updatedById);

      // 2. Load existing variants (with their options)
      const existingVariants = await uowCtx
        .getVariantRepository()
        .findMany({ productId: id, deletedAt: null });

      // 3. Determine which variants to delete (domain logic)
      const incomingVariantNames = new Set(data.variants.map((v) => v.name));
      const variantsToDelete = ProductDomainService.determineVariantsToDelete(
        existingVariants,
        incomingVariantNames,
      );

      if (variantsToDelete.length > 0) {
        const optionIdsToDelete =
          ProductDomainService.collectOptionIdsFromVariants(variantsToDelete);
        if (optionIdsToDelete.length > 0) {
          await uowCtx
            .getVariantOptionRepository()
            .deleteMany(optionIdsToDelete, updatedById);
        }
        await uowCtx.getVariantRepository().deleteMany(
          variantsToDelete.map((v) => v.getId()!),
          updatedById,
        );
      }

      // 4. Upsert variants and build variant map (name -> saved Variant entity)
      const existingVariantMap = new Map(
        existingVariants.map((v) => [v.getName(), v]),
      );
      const savedVariantsMap = new Map<string, Variant>();
      for (const variantData of data.variants) {
        const existing = existingVariantMap.get(variantData.name);
        let variantEntity: Variant;
        if (existing) {
          existing.update({ name: variantData.name });
          variantEntity = await uowCtx
            .getVariantRepository()
            .save(existing, updatedById);
        } else {
          variantEntity = await uowCtx
            .getVariantRepository()
            .save(
              Variant.create({ name: variantData.name, productId: id }),
              updatedById,
            );
        }
        savedVariantsMap.set(variantData.name, variantEntity);
      }

      // 5. Sync variant options per variant
      const allExistingOptions = await uowCtx
        .getVariantOptionRepository()
        .findMany({
          variantId: {
            in: [...savedVariantsMap.values()].map((v) => v.getId()),
          },
          deletedAt: null,
        });

      const existingOptionMap = new Map<string, VariantOption>();
      for (const opt of allExistingOptions) {
        existingOptionMap.set(`${opt.getVariantId()}:${opt.getValue()}`, opt);
      }

      // Delete options no longer in the payload (domain logic)
      const incomingOptionKeys = ProductDomainService.buildIncomingOptionKeys(
        data.variants,
        savedVariantsMap,
      );
      const optionsToDelete = ProductDomainService.determineOptionsToDelete(
        existingOptionMap,
        incomingOptionKeys,
      );
      if (optionsToDelete.length > 0) {
        await uowCtx
          .getVariantOptionRepository()
          .deleteMany(optionsToDelete, updatedById);
      }

      // Upsert options and build option lookup map for SKU resolution
      const savedOptionMap = new Map<string, VariantOption>();
      for (const variantData of data.variants) {
        const variant = savedVariantsMap.get(variantData.name)!;
        for (const optValue of variantData.options) {
          const key = `${variant.getId()}:${optValue}`;
          const existingOpt = existingOptionMap.get(key);
          let savedOpt: VariantOption;
          if (existingOpt) {
            savedOpt = await uowCtx
              .getVariantOptionRepository()
              .save(existingOpt, updatedById);
          } else {
            savedOpt = await uowCtx.getVariantOptionRepository().save(
              VariantOption.create({
                value: optValue,
                variantId: variant.getId()!,
              }),
              updatedById,
            );
          }
          savedOptionMap.set(key, savedOpt);
        }
      }

      // 6. Sync SKUs
      const existingSKUs = await uowCtx
        .getSkuRepository()
        .findMany({ productId: id, deletedAt: null });

      const incomingSkuValues = new Set(data.skus.map((s) => s.value));
      const skusToDelete = ProductDomainService.determineSkusToDelete(
        existingSKUs,
        incomingSkuValues,
      );
      if (skusToDelete.length > 0) {
        await uowCtx.getSkuRepository().deleteMany(
          skusToDelete.map((s) => s.getId()!),
          updatedById,
        );
      }

      const existingSkuMap = new Map(
        existingSKUs.map((s) => [s.getValue(), s]),
      );

      // 7. Upsert SKUs — resolve variant option IDs via domain service
      for (const skuData of data.skus) {
        const variantOptionIds =
          ProductDomainService.resolveSkuVariantOptionIds(
            skuData.options,
            savedVariantsMap,
            [...savedOptionMap.values()],
          );

        const existing = existingSkuMap.get(skuData.value);
        if (existing) {
          existing.update({
            price: skuData.price,
            stock: skuData.stock,
            images: skuData.images,
            variantOptionIds,
          });
          await uowCtx.getSkuRepository().save(existing, updatedById);
        } else {
          await uowCtx.getSkuRepository().save(
            Sku.create({
              value: skuData.value,
              price: skuData.price,
              stock: skuData.stock,
              images: skuData.images,
              productId: id,
              variantOptionIds,
            }),
            updatedById,
          );
        }
      }

      return { message: 'Product updated successfully' };
    });
  }
}
