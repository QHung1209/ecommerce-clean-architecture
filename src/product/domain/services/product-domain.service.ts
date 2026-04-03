import { Sku } from '../entities/sku.entity';
import { Variant } from '../entities/variant.entity';
import { VariantOption } from '../entities/variant-option.entity';

/**
 * Input types for the domain service
 */
export type VariantInput = {
  id?: number;
  name: string;
  options: string[];
};

export type SkuInput = {
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

/**
 * Pure domain service that handles complex product aggregate logic:
 * - Resolving variant option IDs for SKUs
 * - Determining which variants/options/SKUs to delete during update
 */
export class ProductDomainService {
  /**
   * Resolves variant option IDs for a list of SKU inputs
   * given the saved variants and variant options.
   *
   * Business rule: each SKU option must reference a valid variant name
   * and option value combination.
   */
  static resolveSkuVariantOptionIds(
    skuOptions: { name: string; value: string }[],
    savedVariantsMap: Map<string, Variant>,
    variantOptionEntities: VariantOption[],
  ): number[] {
    return skuOptions.map((option) => {
      const variant = savedVariantsMap.get(option.name);
      if (!variant) {
        throw new Error(`Variant "${option.name}" not found`);
      }
      const variantOption = variantOptionEntities.find(
        (vo) =>
          vo.getVariantId() === variant.getId() &&
          vo.getValue() === option.value,
      );
      if (!variantOption) {
        throw new Error(
          `VariantOption "${option.name}:${option.value}" not found`,
        );
      }
      return variantOption.getId();
    });
  }

  /**
   * Determines which existing variants should be deleted
   * (those not present in the incoming variant list).
   *
   * Business rule: variants not in the new list are soft-deleted.
   */
  static determineVariantsToDelete(
    existingVariants: Variant[],
    incomingVariantNames: Set<string>,
  ): Variant[] {
    return existingVariants.filter(
      (v) => !incomingVariantNames.has(v.getName()),
    );
  }

  /**
   * Determines which existing SKUs should be deleted
   * (those not present in the incoming SKU list).
   *
   * Business rule: SKUs not in the new list are soft-deleted.
   */
  static determineSkusToDelete(
    existingSKUs: Sku[],
    incomingSkuValues: Set<string>,
  ): Sku[] {
    return existingSKUs.filter((s) => !incomingSkuValues.has(s.getValue()));
  }

  /**
   * Determines which existing variant options should be deleted
   * based on the incoming option keys.
   *
   * Business rule: options not in the new list are soft-deleted.
   */
  static determineOptionsToDelete(
    existingOptionMap: Map<string, VariantOption>,
    incomingOptionKeys: Set<string>,
  ): number[] {
    return [...existingOptionMap.entries()]
      .filter(([key]) => !incomingOptionKeys.has(key))
      .map(([, opt]) => opt.getId()!);
  }

  /**
   * Builds a Set of incoming option keys in the format `${variantId}:${value}`
   * for comparison with existing options.
   */
  static buildIncomingOptionKeys(
    variantInputs: VariantInput[],
    savedVariantsMap: Map<string, Variant>,
  ): Set<string> {
    const keys = new Set<string>();
    for (const variantData of variantInputs) {
      const variantId = savedVariantsMap.get(variantData.name)!.getId();
      for (const optValue of variantData.options) {
        keys.add(`${variantId}:${optValue}`);
      }
    }
    return keys;
  }

  /**
   * Collects all variant option IDs from variants to be deleted.
   */
  static collectOptionIdsFromVariants(variants: Variant[]): number[] {
    return variants.flatMap((v) => {
      const opts = v.getVariantOptions() ?? [];
      return opts.map((o) => o.getId());
    });
  }
}
