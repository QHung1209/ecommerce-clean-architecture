import { BaseEntity } from 'src/shared/domain/entities/entity';

type BrandProps = {
  logo: string;
  name: string;
  description: string;
};

export class Brand extends BaseEntity<BrandProps> {
  constructor(props: BrandProps, id?: number) {
    super(props, id);
  }

  getLogo(): string {
    return this.props.logo;
  }

  getName(): string {
    return this.props.name;
  }

  getDescription(): string {
    return this.props.description;
  }

  static create(props: BrandProps, id?: number) {
    return new Brand(props, id);
  }

  update(props: Partial<BrandProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
