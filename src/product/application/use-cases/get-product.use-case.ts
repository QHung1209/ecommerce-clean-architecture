import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from 'src/product/domain/interfaces/product-repository.interface';
import { PRODUCT_REPOSITORY } from 'src/product/product.constants';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: number, languageCode?: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return this.productRepository.getProductDetail(id, languageCode);
  }
}
