import { BaseEntity } from 'src/shared/domain/entities/entity';
import { Product } from './product.entity';
import { VariantOption } from './variant-option.entity';

export type SkuProps = {
  value: string;
  productId: number;
  product?: Product;
  price: number;
  stock: number;
  images: string[];
  variantOptionIds: number[];
  variantOptions?: VariantOption[];
};

export class Sku extends BaseEntity<SkuProps> {
  constructor(props: SkuProps, id?: number) {
    super(props, id);
  }

  getValue(): string {
    return this.props.value;
  }

  getProductId(): number {
    return this.props.productId;
  }

  getProduct(): Product | undefined {
    return this.props.product;
  }

  getPrice(): number {
    return this.props.price;
  }

  getStock(): number {
    return this.props.stock;
  }

  getImages(): string[] {
    return this.props.images;
  }

  getVariantOptionIds(): number[] {
    return this.props.variantOptionIds;
  }

  getVariantOptions(): VariantOption[] | undefined {
    return this.props.variantOptions;
  }

  static create(props: SkuProps, id?: number): Sku {
    return new Sku(props, id);
  }

  update(props: Partial<SkuProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
