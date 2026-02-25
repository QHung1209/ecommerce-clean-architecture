import { BaseEntity } from 'src/shared/domain/entities/entity';

type CategoryTranslationProps = {
  name: string;
  description: string;
  languageCode: string;
  categoryId: number;
  slug: string;
};

export class CategoryTranslation extends BaseEntity<CategoryTranslationProps> {
  constructor(props: CategoryTranslationProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  getLanguageCode(): string {
    return this.props.languageCode;
  }

  getCategoryId(): number {
    return this.props.categoryId;
  }

  getSlug(): string {
    return this.props.slug;
  }

  static create(props: CategoryTranslationProps, id?: number) {
    return new CategoryTranslation(props, id);
  }

  update(props: Partial<CategoryTranslationProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
