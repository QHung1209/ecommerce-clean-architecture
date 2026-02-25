import { BaseEntity } from 'src/shared/domain/entities/entity';

type BrandTranslationProps = {
  name: string;
  description: string;
  languageCode: string;
  brandId: number;
  logo: string;
};

export class BrandTranslation extends BaseEntity<BrandTranslationProps> {
  constructor(props: BrandTranslationProps, id?: number) {
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

  getBrandId(): number {
    return this.props.brandId;
  }

  getLogo(): string {
    return this.props.logo;
  }

  static create(props: BrandTranslationProps, id?: number) {
    return new BrandTranslation(props, id);
  }

  update(props: Partial<BrandTranslationProps>) {
    this.props = { ...this.props, ...props };
    return this;
  }
}
