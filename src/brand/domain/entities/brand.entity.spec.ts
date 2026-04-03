import { Brand } from './brand.entity';

describe('Brand Entity', () => {
  it('should create a Brand entity successfully', () => {
    const props = { name: 'Nike', description: 'Sportswear', logo: 'nike.png' };
    const brand = Brand.create(props);

    expect(brand.getName()).toBe('Nike');
    expect(brand.getDescription()).toBe('Sportswear');
    expect(brand.getLogo()).toBe('nike.png');
  });

  it('should update a Brand entity', () => {
    const brand = Brand.create({ name: 'Nike', description: '', logo: '' });
    brand.update({ logo: 'new-nike.png' });
    
    expect(brand.getLogo()).toBe('new-nike.png');
    expect(brand.getName()).toBe('Nike');
  });
});
