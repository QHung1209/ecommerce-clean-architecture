import { Product } from 'src/product/domain/entities/product.entity';

export class ProductResponseMapper {
  static toCreateResponse(product: Product): any {
    return {
      id: product.getId(),
      name: product.getName(),
      basePrice: product.getBasePrice(),
      virtualPrice: product.getVirtualPrice(),
      brandId: product.getBrandId(),
      images: product.getImages(),
      description: product.getDescription(),
      categoryIds: product.getCategoryIds(),
    };
  }
}
