import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

@Injectable()
export class DeleteCategoryTranslationUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(id: number, deletedById: number) {
    await this.categoryTranslationRepository.delete(id, deletedById);
  }
}
