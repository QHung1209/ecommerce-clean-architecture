import { Sku } from './sku.entity';

describe('Sku Entity', () => {
  it('should create a Sku entity successfully', () => {
    const props = {
      value: 'SKU123',
      productId: 1,
      price: 1500,
      stock: 10,
      images: ['sku.png'],
      variantOptionIds: [100, 200],
    };
    const sku = Sku.create(props);

    expect(sku.getValue()).toBe('SKU123');
    expect(sku.getPrice()).toBe(1500);
    expect(sku.getStock()).toBe(10);
    expect(sku.getVariantOptionIds()).toEqual([100, 200]);
  });

  it('should update a Sku entity', () => {
    const sku = Sku.create({ value: 'S1', productId: 1, price: 0, stock: 0, images: [], variantOptionIds: [] });
    sku.update({ stock: 5, price: 50 });
    
    expect(sku.getStock()).toBe(5);
    expect(sku.getPrice()).toBe(50);
  });
});
