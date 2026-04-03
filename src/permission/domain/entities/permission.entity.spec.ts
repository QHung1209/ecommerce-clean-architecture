import { Permission } from './permission.entity';
import { HTTPMethod } from 'src/shared/domain/enums/http-method.enum';

describe('Permission Entity', () => {
  it('should create a Permission entity successfully', () => {
    const props = {
      name: 'Create Product',
      description: 'Allows creating product',
      path: '/products',
      method: HTTPMethod.POST,
    };
    const permission = Permission.create(props);

    expect(permission.getName()).toBe('Create Product');
    expect(permission.getPath()).toBe('/products');
    expect(permission.getMethod()).toBe(HTTPMethod.POST);
  });

  it('should update a Permission entity', () => {
    const permission = Permission.create({
      name: 'Old',
      description: '',
      path: '/',
      method: HTTPMethod.GET,
    });
    permission.update({ name: 'New' });

    expect(permission.getName()).toBe('New');
  });
});
