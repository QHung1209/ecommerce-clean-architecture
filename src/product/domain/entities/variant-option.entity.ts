import { BaseEntity } from 'src/shared/domain/entities/entity';
import { Variant } from './variant.entity';

export type VariantOptionProps = {
  value: string;
  variantId: number;
  variant?: Variant;
};

export class VariantOption extends BaseEntity<VariantOptionProps> {
  constructor(props: VariantOptionProps, id?: number) {
    super(props, id);
  }

  getValue(): string {
    return this.props.value;
  }

  getVariantId(): number {
    return this.props.variantId;
  }

  getVariant(): Variant | undefined {
    return this.props.variant;
  }

  static create(props: VariantOptionProps, id?: number): VariantOption {
    return new VariantOption(props, id);
  }

  update(props: Partial<VariantOptionProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
