import { Brand } from 'src/brand/domain/entities/brand.entity';
import { Category } from 'src/category/domain/entities/category.entity';
import { BaseEntity } from 'src/shared/domain/entities/entity';

export type ProductProps = {
  name: string;
  basePrice: number;
  virtualPrice: number;
  description: string;
  brandId: number;
  brand?: Brand
  images: string[];
  categoryIds: number[];
  categories?: Category[];
};

export class Product extends BaseEntity<ProductProps> {
  constructor(props: ProductProps, id?: number) {
    super(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getBasePrice(): number {
    return this.props.basePrice;
  }

  getVirtualPrice(): number {
    return this.props.virtualPrice;
  }

  getDescription(): string {
    return this.props.description;
  }

  getBrandId(): number {
    return this.props.brandId;
  }

  getBrand(): Brand | undefined {
    return this.props.brand;
  }

  getImages(): string[] {
    return this.props.images;
  }

  getCategoryIds(): number[] {
    return this.props.categoryIds;
  }

  getCategories(): Category[] | undefined {
    return this.props.categories;
  }

  public static create(props: ProductProps, id?: number) {
    return new Product(props, id);
  }

  public update(props: Partial<ProductProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
