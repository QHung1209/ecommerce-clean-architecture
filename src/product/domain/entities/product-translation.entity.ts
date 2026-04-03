import { BaseEntity } from 'src/shared/domain/entities/entity';

export type ProductTranslationProps = {
  name: string;
  description: string;
  languageCode: string;
  productId: number;
};

export class ProductTranslation extends BaseEntity<ProductTranslationProps> {
  constructor(props: ProductTranslationProps, id?: number) {
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

  getProductId(): number {
    return this.props.productId;
  }

  public static create(props: ProductTranslationProps, id?: number) {
    return new ProductTranslation(props, id);
  }

  public update(props: Partial<ProductTranslationProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
