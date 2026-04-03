import { Category } from './category.entity';

describe('Category Entity', () => {
  const getProps = () => ({
    name: 'Electronics',
    description: 'Tech gadgets',
    slug: 'electronics',
    logo: 'logo.png',
  });

  it('should create successfully and update properties', () => {
    const entity = Category.create(getProps());
    entity.update({ description: 'New description' });
    expect(entity.getDescription()).toBe('New description');
  });

  describe('domain rules', () => {
    it('ensureCanDelete should pass when category has no children', () => {
      const entity = Category.create(getProps());
      expect(() => entity.ensureCanDelete(false)).not.toThrow();
    });

    it('ensureCanDelete should throw Error when category has children', () => {
      const entity = Category.create(getProps());
      expect(() => entity.ensureCanDelete(true)).toThrow('Cannot delete category that has children');
    });
  });
});
