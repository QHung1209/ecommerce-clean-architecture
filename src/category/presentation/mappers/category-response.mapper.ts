import { Category } from 'src/category/domain/entities/category.entity';

export class CategoryResponseMapper {
  static toResponse(category: Category): any {
    return {
      id: category.getId(),
      name: category.getName(),
      description: category.getDescription(),
      slug: category.getSlug(),
      logo: category.getLogo(),
      parentCategoryId: category.getParentCategoryId(),
    };
  }

  static toResponseList(categories: Category[]): any {
    const data = categories.map((category) => this.toResponse(category));
    return this.buildCategoryTree(data);
  }

  static toPaginatedResponse(result: any) {
    return {
      data: this.toResponseList(result.categories),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }

  static buildCategoryTree(categories: any[]) {
    const categoryMap = new Map<number, any>();
    const rootCategories: any[] = [];
    categories.forEach((category) => {
      categoryMap.set(category.id, category);
    });
    categories.forEach((category) => {
      const node = categoryMap.get(category.id);
      const parent = category.parentCategoryId
        ? categoryMap.get(category.parentCategoryId)
        : null;
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        rootCategories.push(node);
      }
    });
    return rootCategories;
  }
}
