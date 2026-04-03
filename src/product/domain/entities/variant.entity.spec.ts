import { Variant } from './variant.entity';
import { VariantOption } from './variant-option.entity';

describe('Variant Entity', () => {
  it('should create a Variant entity successfully', () => {
    const props = { name: 'Color', productId: 1 };
    const variant = Variant.create(props);

    expect(variant.getName()).toBe('Color');
    expect(variant.getProductId()).toBe(1);
    expect(variant.getVariantOptions()).toBeUndefined();
  });

  it('should set variant options', () => {
    const variant = Variant.create({ name: 'Color', productId: 1 }, 10);
    const option = VariantOption.create({ value: 'Red', variantId: 10 }, 101);

    variant.update({ variantOptions: [option] });
    expect(variant.getVariantOptions()?.length).toBe(1);
    expect(variant.getVariantOptions()?.[0].getValue()).toBe('Red');
  });
});
