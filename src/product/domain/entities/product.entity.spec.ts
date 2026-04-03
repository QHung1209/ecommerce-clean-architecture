import { Product } from './product.entity';

describe('Product Entity', () => {
  it('should create a Product entity successfully', () => {
    const props = {
      name: 'Laptop',
      description: 'Gaming laptop',
      basePrice: 1500,
      virtualPrice: 2000,
      brandId: 1,
      images: ['img1.png'],
      categoryIds: [1, 2],
    };
    const product = Product.create(props);

    expect(product.getName()).toBe('Laptop');
    expect(product.getBasePrice()).toBe(1500);
    expect(product.getCategoryIds()).toEqual([1, 2]);
  });

  it('should update a Product entity', () => {
    const product = Product.create({ name: 'Laptop', description: '', basePrice: 0, virtualPrice: 0, brandId: 1, images: [], categoryIds: [] });
    product.update({ name: 'Pro Laptop', basePrice: 2000 });
    
    expect(product.getName()).toBe('Pro Laptop');
    expect(product.getBasePrice()).toBe(2000);
  });
});
