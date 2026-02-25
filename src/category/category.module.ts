import { Module } from '@nestjs/common';
import { PrismaCategoryRepository } from './infrastructure/prisma/repositories/prisma-category.repository';
import {
  CATEGORY_REPOSITORY,
  CATEGORY_TRANSLATION_REPOSITORY,
} from './category.constants';
import { PrismaCategoryTranslationRepository } from './infrastructure/prisma/repositories/prisma-category-translation.repository';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { ListCategoryUseCase } from './application/use-cases/list-categories.use-case';
import { GetCategoryUseCase } from './application/use-cases/get-category.use-case';
import { CreateCategoryTranslationUseCase } from './application/use-cases/translation/create-category-translation.use-case';
import { CategoryController } from './presentation/controllers/category.controller';
import { CategoryTranslationController } from './presentation/controllers/category-translation.controller';
import { UpdateCategoryTranslationUseCase } from './application/use-cases/translation/update-category-translation.use-case';
import { DeleteCategoryTranslationUseCase } from './application/use-cases/translation/delete-category-translation.use-case';
import { GetCategoryTranslationUseCase } from './application/use-cases/translation/get-category-translation.use-case';
import { ListCategoryTranslationsUseCase } from './application/use-cases/translation/list-category-translations.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';

@Module({
  imports: [],
  providers: [
    {
      useClass: PrismaCategoryRepository,
      provide: CATEGORY_REPOSITORY,
    },
    {
      useClass: PrismaCategoryTranslationRepository,
      provide: CATEGORY_TRANSLATION_REPOSITORY,
    },

    CreateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,

    CreateCategoryTranslationUseCase,
    UpdateCategoryTranslationUseCase,
    DeleteCategoryTranslationUseCase,
    GetCategoryTranslationUseCase,
    ListCategoryTranslationsUseCase,
  ],
  controllers: [CategoryController, CategoryTranslationController],
  exports: [],
})
export class CategoryModule {}
