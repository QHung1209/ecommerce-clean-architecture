import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';

@Injectable()
export class ListCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async execute(languageCode?: string) {
    return this.categoryRepository.findAllCategories({ languageCode });
  }
}
