import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async execute(data: any, languageCode?: string) {
    const { value } = data;
    const condition = isNaN(Number(value))
      ? { slug: value }
      : { id: Number(value) };
    const category = await this.categoryRepository.findByCondition(
      condition,
      languageCode,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
