import { Controller, Get, Param, Headers } from '@nestjs/common';
import { GetProductUseCase } from 'src/product/application/use-cases/get-product.use-case';

@Controller('products')
export class ProductController {
  constructor(private readonly getProductUseCase: GetProductUseCase) {}

  @Get(':id')
  async detail(
    @Param('id') id: number,
    @Headers('Accept-Language') languageCode?: string,
  ) {
    return this.getProductUseCase.execute(id, languageCode);
  }
}
