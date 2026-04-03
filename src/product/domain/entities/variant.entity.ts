import { BaseEntity } from 'src/shared/domain/entities/entity';
import { VariantOption } from './variant-option.entity';

type VariantProps = {
  name: string;
  productId: number;
  variantOptions?: VariantOption[];
};

export class Variant extends BaseEntity<VariantProps> {
  constructor(props: VariantProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getProductId(): number {
    return this.props.productId;
  }

  getVariantOptions(): VariantOption[] | undefined {
    return this.props.variantOptions;
  }

  static create(props: VariantProps, id?: number): Variant {
    return new Variant(props, id);
  }

  update(props: Partial<VariantProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
