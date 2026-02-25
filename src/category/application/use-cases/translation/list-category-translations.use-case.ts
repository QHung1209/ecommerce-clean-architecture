import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';
import { ISharedQuery } from 'src/shared/domain/interfaces/query.interface';

@Injectable()
export class ListCategoryTranslationsUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(categoryId: number, query: ISharedQuery) {
    const translations =
      await this.categoryTranslationRepository.findByCategoryId(
        categoryId,
        query,
      );
    const total =
      await this.categoryTranslationRepository.countByCategoryId(categoryId);
    return {
      data: translations,
      total,
      totalPages: Math.ceil(total / +query.limit),
      currentPage: +query.page,
    };
  }
}
