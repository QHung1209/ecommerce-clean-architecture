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
    const childrenCategoryIds =
      await this.categoryRepository.getCategoriesByParentCategoryId(id);
    if (childrenCategoryIds.length > 0) {
      throw new BadRequestException('Category has children');
    }

    //Future: Check product
    
    await this.categoryTranslationRepository.deleteByCategoryId(
      id,
      deletedById,
    );
    await this.categoryRepository.delete(id, deletedById);
  }
}
