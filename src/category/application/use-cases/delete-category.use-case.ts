import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CATEGORY_REPOSITORY,
  CATEGORY_TRANSLATION_REPOSITORY,
} from 'src/category/category.constants';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';
import type { ICategoryTranslationRepository } from 'src/category/domain/interfaces/category-translation-repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}
  async execute(id: number, deletedById: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const childrenCategories =
      await this.categoryRepository.getCategoriesByParentCategoryId(id);

    try {
      category.ensureCanDelete(childrenCategories.length > 0);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Category has children',
      );
    }

    //Future: Check product

    await this.categoryTranslationRepository.deleteByCategoryId(
      id,
      deletedById,
    );
    await this.categoryRepository.delete(id, deletedById);
  }
}
