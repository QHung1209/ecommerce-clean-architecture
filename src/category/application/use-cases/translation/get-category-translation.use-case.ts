import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

@Injectable()
export class GetCategoryTranslationUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(id: number) {
    const category = await this.categoryTranslationRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category translation not found');
    }
    return category;
  }
}
