import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/category/category.constants';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';

type UpdateCategoryCommand = {
  name?: string;
  description?: string;
  slug?: string;
  logo?: string;
  parentCategoryId?: number;
};

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async execute(id: number, data: UpdateCategoryCommand, updatedById: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    category.update(data);
    return this.categoryRepository.save(category, updatedById);
  }
}
