import { BaseEntity } from 'src/shared/domain/entities/entity';

type CategoryProps = {
  name: string;
  description: string;
  slug: string;
  logo: string;
  parentCategoryId: number | null;
  childrenCategoryIds?: number[];
};

export class Category extends BaseEntity<CategoryProps> {
  constructor(props: CategoryProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getSlug(): string {
    return this.props.slug;
  }

  getLogo(): string {
    return this.props.logo;
  }

  getParentCategoryId(): number | null {
    return this.props.parentCategoryId;
  }

  getChildrenCategoryIds(): number[] {
    return this.props.childrenCategoryIds ?? [];
  }

  static create(props: CategoryProps, id?: number) {
    return new Category(props, id);
  }

  update(props: Partial<CategoryProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }

  /**
   * Domain rule: a category cannot be deleted if it has children.
   * Throws domain error if deletion is not allowed.
   */
  ensureCanDelete(hasChildren: boolean): void {
    if (hasChildren) {
      throw new Error('Cannot delete category that has children');
    }
  }
}
