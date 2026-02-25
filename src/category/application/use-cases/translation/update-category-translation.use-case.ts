import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

type UpdateCategoryTranslationCommand = {
  name?: string;
  description?: string;
  languageCode?: string;
  categoryId?: number;
  slug?: string;
};

@Injectable()
export class UpdateCategoryTranslationUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(
    id: number,
    data: UpdateCategoryTranslationCommand,
    updatedById: number,
  ) {
    const categoryTranslation =
      await this.categoryTranslationRepository.findById(id);
    if (!categoryTranslation) {
      throw new NotFoundException('Category translation not found');
    }
    categoryTranslation.update(data);
    return this.categoryTranslationRepository.save(
      categoryTranslation,
      updatedById,
    );
  }
}
