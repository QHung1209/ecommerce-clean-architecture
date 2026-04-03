import { Module } from '@nestjs/common';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import {
  PRODUCT_REPOSITORY,
  SKU_REPOSITORY,
  VARIANT_OPTION_REPOSITORY,
  VARIANT_REPOSITORY,
} from './product.constants';
import { ManageProductController } from './presentation/controllers/manage-product.controller';
import { PrismaSkuRepository } from './infrastructure/repositories/prisma-sku.repository';
import { PrismaVariantRepository } from './infrastructure/repositories/prisma-variant.repository';
import { PrismaVariantOptionRepository } from './infrastructure/repositories/prisma-variant-option.repository';
import { ProductController } from './presentation/controllers/product.controller';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';

@Module({
  imports: [],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    {
      provide: SKU_REPOSITORY,
      useClass: PrismaSkuRepository,
    },
    {
      provide: VARIANT_REPOSITORY,
      useClass: PrismaVariantRepository,
    },
    {
      provide: VARIANT_OPTION_REPOSITORY,
      useClass: PrismaVariantOptionRepository,
    },
    CreateProductUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
  ],
  exports: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  controllers: [ManageProductController, ProductController],
})
export class ProductModule {}
