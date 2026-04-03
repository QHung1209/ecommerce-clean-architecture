import { ProductDomainService, VariantInput, SkuInput } from './product-domain.service';
import { Variant } from '../entities/variant.entity';
import { VariantOption } from '../entities/variant-option.entity';
import { Sku } from '../entities/sku.entity';

describe('ProductDomainService', () => {
  describe('resolveSkuVariantOptionIds', () => {
    it('should correctly resolve variant option IDs given valid SKU options', () => {
      const variant1 = Variant.create({ name: 'Color', productId: 1 }, 10);
      const savedVariantsMap = new Map<string, Variant>();
      savedVariantsMap.set('Color', variant1);

      const option1 = VariantOption.create({ value: 'Red', variantId: 10 }, 100);
      const variantOptionEntities = [option1];

      const skuOptions = [{ name: 'Color', value: 'Red' }];

      const result = ProductDomainService.resolveSkuVariantOptionIds(
        skuOptions,
        savedVariantsMap,
        variantOptionEntities,
      );

      expect(result).toEqual([100]);
    });

    it('should throw an error if variant is not found in the map', () => {
      const savedVariantsMap = new Map<string, Variant>();
      expect(() => {
        ProductDomainService.resolveSkuVariantOptionIds(
          [{ name: 'UnknownVariant', value: 'Value' }],
          savedVariantsMap,
          [],
        );
      }).toThrow('Variant "UnknownVariant" not found');
    });
  });

  describe('determineVariantsToDelete', () => {
    it('should return existing variants that are missing from the incoming set', () => {
      const v1 = Variant.create({ name: 'Color', productId: 1 }, 1);
      const incomingNames = new Set(['Size']); 
      const result = ProductDomainService.determineVariantsToDelete([v1], incomingNames);
      expect(result).toHaveLength(1);
    });
  });

  describe('determineSkusToDelete', () => {
    it('should return existing SKUs missing from incoming set', () => {
      const s1 = Sku.create({ value: 'SKU-001', price: 100, stock: 10, productId: 1, images: [], variantOptionIds: [] });
      const incomingSet = new Set(['SKU-002']);
      const result = ProductDomainService.determineSkusToDelete([s1], incomingSet);
      expect(result).toHaveLength(1);
    });
  });
});
