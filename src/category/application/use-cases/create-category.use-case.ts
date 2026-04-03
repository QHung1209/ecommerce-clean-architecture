import { ConflictException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from 'src/category/category.constants';
import { Category } from 'src/category/domain/entities/category.entity';
import type { ICategoryRepository } from 'src/category/domain/interfaces/category-repository.interface';

type CreateCategoryCommand = {
  name: string;
  description: string;
  slug: string;
  logo: string;
  parentCategoryId: number;
};

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}
  async execute(category: CreateCategoryCommand, createdById: number) {
    const existsCategory = await this.categoryRepository.findByCondition({
      slug: category.slug,
    });
    if (existsCategory) {
      throw new ConflictException('Category already exists');
    }
    const categoryEntity = Category.create(category);
    return this.categoryRepository.save(categoryEntity, createdById);
  }
}
