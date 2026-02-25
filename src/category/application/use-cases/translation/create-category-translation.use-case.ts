import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from 'src/category/category.constants';
import { CategoryTranslation } from 'src/category/domain/entities/category.translation.entity';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

type CreateCategoryTranslationCommand = {
  name: string;
  description: string;
  languageCode: string;
  categoryId: number;
  slug: string;
};

@Injectable()
export class CreateCategoryTranslationUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(data: CreateCategoryTranslationCommand, createdById: number) {
    const categoryTranslation = CategoryTranslation.create(data);
    return this.categoryTranslationRepository.save(
      categoryTranslation,
      createdById,
    );
  }
}
