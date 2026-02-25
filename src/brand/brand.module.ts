import { Module } from '@nestjs/common';
import { PrismaBrandRepository } from './infrastructure/prisma/repositories/prisma-brand.repository';
import {
  BRAND_REPOSITORY,
  BRAND_TRANSLATION_REPOSITORY,
} from './brand.constants';
import { PrismaBrandTranslationRepository } from './infrastructure/prisma/repositories/prisma-brand-translation.repository';
import { CreateBrandUseCase } from './application/use-cases/create-brand.use-case';
import { GetBrandUseCase } from './application/use-cases/get-brand.use-case';
import { ListBrandsUseCase } from './application/use-cases/list-brands.use-case';
import { UpdateBrandUseCase } from './application/use-cases/update-brand.use-case';
import { DeleteBrandUseCase } from './application/use-cases/delete-brand.use-case';
import { CreateBrandTranslationUseCase } from './application/use-cases/translation/create-brand-translation.use-case';
import { GetBrandTranslationUseCase } from './application/use-cases/translation/get-brand-translation.use-case';
import { ListBrandTranslationsUseCase } from './application/use-cases/translation/list-brand-translations.use-case';
import { UpdateBrandTranslationUseCase } from './application/use-cases/translation/update-brand-translation.use-case';
import { DeleteBrandTranslationUseCase } from './application/use-cases/translation/delete-brand-translation.use-case';
import { BrandController } from './presentation/controllers/brand.controller';
import { BrandTranslationController } from './presentation/controllers/brand-translation.controller';

@Module({
  imports: [],
  providers: [
    {
      useClass: PrismaBrandRepository,
      provide: BRAND_REPOSITORY,
    },
    {
      useClass: PrismaBrandTranslationRepository,
      provide: BRAND_TRANSLATION_REPOSITORY,
    },

    CreateBrandUseCase,
    GetBrandUseCase,
    ListBrandsUseCase,
    UpdateBrandUseCase,
    DeleteBrandUseCase,

    CreateBrandTranslationUseCase,
    GetBrandTranslationUseCase,
    ListBrandTranslationsUseCase,
    UpdateBrandTranslationUseCase,
    DeleteBrandTranslationUseCase,
  ],
  controllers: [BrandController, BrandTranslationController],
  exports: [],
})
export class BrandModule {}
